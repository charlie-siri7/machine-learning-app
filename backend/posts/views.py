from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def receive_data(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        data = body.get('data')
        headers = body.get('headers')
        print("Headers received:", headers)
        print("# of rows received:", len(data))
        if data:
            print("First row:", data[0])
        # Process or save data/headers as needed
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid request'}, status=400)