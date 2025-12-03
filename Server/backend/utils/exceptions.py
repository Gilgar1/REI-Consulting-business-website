from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    # Let DRF build the basic response first
    response = exception_handler(exc, context)

    if response is not None:
        data = {
            'success': False,
            'errors': response.data,
            'status_code': response.status_code,
        }
        return Response(data, status=response.status_code)

    # Fallback for unhandled exceptions
    return Response({'success': False, 'errors': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
