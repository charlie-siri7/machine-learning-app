from rest_framework.viewsets import ModelViewSet
from ..models import Post
from .serializers import PostSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
import pandas as pd
import numpy as np
import logging
import json
import simplejson as json

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

@csrf_exempt
def sort_csv(request):
    if request.method != 'POST' or 'file' not in request.FILES:
        return HttpResponseBadRequest("POST with 'file' required")
    
    # dataframe representing the .csv file
    df = pd.read_csv(
        request.FILES['file'],
        skipinitialspace=True,
        na_values=['', 'None', 'NULL', 'n/a', 'NA']
    )

    # get column to sort by and check to make sure the column exists
    sort_col = request.POST.get('column')
    if sort_col not in df.columns:
        return HttpResponseBadRequest(f"Column '{sort_col}' not found.")

    # Make records from the dataframe sorted by the selected column
    df_sorted = df.sort_values(by=sort_col, na_position='last')
    records = df_sorted.to_dict(orient="records")
    # Get json payload, ignoring NaN values to avoid errors
    payload = json.dumps(records, ignore_nan=True)
    return HttpResponse(payload, content_type="application/json")

@csrf_exempt
def select_csv(request):
    if request.method != 'POST' or 'file' not in request.FILES:
        return HttpResponseBadRequest("POST with 'file' required")
    
    # dataframe representing the .csv file
    df = pd.read_csv(
        request.FILES['file'],
        skipinitialspace=True,
        na_values=['', 'None', 'NULL', 'n/a', 'NA']
    )

    try:
        value = float(request.POST.get('value'))
    except ValueError:
        value = request.POST.get('value')

    df_selected = df[df[request.POST.get('column')] == value]
    if request.POST.get('operator') == '<':
        df_selected = df[(df[request.POST.get('column')]) > value]
    elif request.POST.get('operator') == '>':
        df_selected = df[(df[request.POST.get('column')]) < value]
    print(f"testing: {df_selected}")
    
    records = df_selected.to_dict(orient="records")
    # Get json payload, ignoring NaN values to avoid errors
    payload = json.dumps(records, ignore_nan=True)
    return HttpResponse(payload, content_type="application/json")