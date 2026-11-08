from django.utils import timezone
from datetime import timedelta, datetime

from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.
class ServiceTestCase(APITestCase):
    url = '/api/service/'
    data = {}

    def setUp(self):
        """ Add setup logic here"""
        self.data = {
            'name': 'test_service',
            'price': 50.00,
            'duration': 12.0
        }
    
    def test_inserting_new_service_should_save_to_database(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_inserting_service_should_return_same_survice_on_get(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response = self.client.get(f"{self.url}{response.data['id']}/", format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertAlmostEqual(response.data['price'], self.data['price'], 0)
        self.assertAlmostEqual(response.data['duration'], self.data['duration'], 0)

    def test_name_is_a_required_attribute(self):
        data = {
            'price': 10.0,
            'duration': 12
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_price_is_a_required_attribute(self):
        data = {
            'name': 'service_name',
            'duration': 12
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duration_is_a_required_attribute(self):
        data = {
            'name': 'service_name',
            'price': 100.00
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_name_must_be_less_than_or_equal_to_100_chars(self):
        data = {
            'name': '',
            'price': 100.00,
            'duration': 12
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['name'] = 'a' * 100
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['name'] += 'a'
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # May want some 'free' services, so 0 is an okay number
    def test_price_must_be_greater_than_or_equal_to_0(self):
        data = {
            'name': 'test_service',
            'price': -1,
            'duration': 12
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['price'] = 0
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['price'] = 1
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # 4 hours is longer than necessary, but is a fine enough upper limit
    def test_duration_must_be_greater_than_or_equal_to_0_and_less_than_240(self):
        data = {
            'name': 'test_service',
            'price': 10.00,
            'duration': 12
        }

        for validDuration in [12, 0, 240]:
            data['duration'] = validDuration
            response = self.client.post(self.url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        for invalidDurations in [-1, 241]:
            data['duration'] = invalidDurations
            response = self.client.post(self.url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

class AppointmentTestCase(APITestCase):
    url = '/api/appointment/'
    data = {}

    def setUp(self):
        customerData = {'firstName': 'Test', 'lastName': 'Customer', 'street': '123 Main St', 'city': 'Omaha', 'state': 'NE', 'zipCode': '12345', 'email': 'test@example.com', 'phoneNumber': '1234567890'}
        groomerData = {'firstName': 'Test', 'lastName': 'Groomer', 'email': 'groomer@example.com', 'phoneNumber': '1234567654', 'availability': '{"sun": {"start": "8:00 AM", "end": "5:00 PM"}}', 'biography': 'Something here', 'photo': 'YmFzZTY0ZGF0YQo='}

        service_one = {'name': 'service one', 'price': 12, 'duration': 3}
        service_two = {'name': 'service_two', 'price': 10, 'duration': 10}

        response = self.client.post('/api/customer/', customerData, format='json')
        customer_id = response.data['id']

        response = self.client.post('/api/groomer/', groomerData, format='json')
        groomer_id = response.data['id']

        services = []
        response = self.client.post('/api/service/', service_one, format='json')
        services.append(response.data['id'])
        
        response = self.client.post('/api/service/', service_two, format='json')
        services.append(response.data['id'])

        self.data = {
            'customer': customer_id,
            'groomer': groomer_id,
            'datetime': timezone.now() + timedelta(hours=1),
            'services': services
        }

    def test_inserts_new_appointment(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_retrieve_appointments_after_creating(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(f"{self.url}{response.data['id']}/", format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(self.data['customer'], response.data['customer'])
        self.assertEqual(self.data['groomer'], response.data['groomer'])
        self.assertEqual(self.data['datetime'], datetime.fromisoformat(response.data['datetime']))
        self.assertEqual(self.data['services'], response.data['services'])

    def test_customer_is_required_and_must_be_a_valid_customer_id(self):
        self.data.pop('customer', None)

        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['customer'] = 5

        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_groomer_is_required_and_must_be_a_valid_groomer_id(self):
        self.data.pop('groomer', None)
        
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['groomer'] = 5

        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_datetime_is_required_and_must_be_in_the_future(self):
        self.data.pop('datetime', None)

        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['datetime'] = timezone.now() - timedelta(hours=1)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_services_is_required_and_it_must_be_a_valid_service_id(self):
        self.data.pop('services', None)

        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['service'] = [10, 11]
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['service'] = []
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)