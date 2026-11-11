from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

# Create your tests here.
class GroomerTestCase(APITestCase):
    url = '/api/groomer/'
    data = {}

    def setUp(self):
        """ Add setup logic here"""
        self.data = {
            'firstName': 'Test',
            'lastName': 'Name',
            'email': 'test@example.com',
            'phoneNumber': '1234567890',
            'availability': '{"sun": {"start": "9:00 AM", "end": "5:00 PM"}}',
            'biography': 'Test Biography',
            'photo': 'YmFzZTY0ZGF0YQo=',
            'photoData': 'data:image/png;base64'
        }

    def test_inserting_new_groomer_should_save_to_database(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_getting_groomer_should_return_all_data_from_database(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_groomer_data = response.json()
        response = self.client.get(f"{self.url}{new_groomer_data['id']}/", format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), new_groomer_data)

    def test_firstName_is_required(self):
        self.data.pop('firstName', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_lastName_is_required(self):
        self.data.pop('lastName', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_is_required(self):
        self.data.pop('email', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        for emailAddress in ['', 'bad_email', 'bad_email@company', 'bad_email@company.', 'bad@test.c']:
            self.data['email'] = emailAddress
            response = self.client.post(self.url, self.data, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, f"{emailAddress} should not be a valid email")

    def test_phoneNumber_is_required(self):
        self.data.pop('phoneNumber', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        for phoneNumber in ['', 'abcdefghij', '0', '123456789', '000000000a', '00000000000']:
            self.data['phoneNumber'] = phoneNumber
            response = self.client.post(self.url, self.data, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, f"{phoneNumber} should not be a valid phone number")

    def test_availability_is_required(self):
        self.data.pop('availability', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_biography_is_required(self):
        self.data.pop('biography', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['biography'] = 'a' * 1_000
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.data['biography'] += 'a'
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_photo_is_required_and_it_must_be_base64_encoded(self):
        self.data.pop('photo', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.data['photo'] = "this isn't base 64 encoded"
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_photoData_is_required(self):
        self.data.pop('photoData', None)
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class CustomerTestCase(APITestCase):
    url = '/api/customer/'
    data = {}

    def setUp(self):
        self.data = {
            'firstName': 'Customer',
            'lastName': 'Test',
            'street': '123 Main St.',
            'street2': 'Apt 12',
            'city': 'Omaha',
            'state': 'NE',
            'zipCode': '12345',
            'email': 'test@company.com',
            'phoneNumber': '4025555555'
        }

    def test_inserting_new_customer_should_save_to_database(self):
        self.assertResponseStatus( status.HTTP_201_CREATED)
    
    def test_getting_customer_should_return_all_data_from_database(self):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_customer_data = response.json()
        response = self.client.get(f"{self.url}{new_customer_data['id']}/", format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), new_customer_data)

    def test_firstName_is_required(self):
        self.data.pop('firstName', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

    def test_lastName_is_required(self):
        self.data.pop('lastName', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

    def test_street_is_required(self):
        self.data.pop('street', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

    def test_street2_is_optional(self):
        self.data.pop('street2', None)
        self.assertResponseStatus(status.HTTP_201_CREATED)

    def test_city_is_required(self):
        self.data.pop('city', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

    def test_state_is_required_and_must_be_2_letters(self):
        self.data.pop('state', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

        for state in ['', 'A', 'a', 'aaa', 12, 'AAA']:
            self.data['state'] = state
            self.assertResponseStatus(status.HTTP_400_BAD_REQUEST, f"{state} is not a valid state")

        for state in ['aa', 'Aa', 'aA', 'AA']:
            self.data['state'] = state
            self.assertResponseStatus(status.HTTP_201_CREATED, f"{state} is a valid state")

    def test_zipCode_is_required_and_must_be_exactly_5_digits(self):
        self.data.pop('zipCode', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

        for zipCode in ['1234', '123456', 'abcde', '1234a']:
            self.data['zipCode'] = zipCode
            self.assertResponseStatus(status.HTTP_400_BAD_REQUEST, f"{zipCode} is not a valid zip code format")

    def test_email_is_required(self):
        self.data.pop('email', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

        for emailAddress in ['', 'bad_email', 'bad_email@company', 'bad_email@company.', 'bad@test.c']:
            self.data['email'] = emailAddress
            self.assertResponseStatus(status.HTTP_400_BAD_REQUEST, f"{emailAddress} should not be a valid email")

    def test_phoneNumber_is_required(self):
        self.data.pop('phoneNumber', None)
        self.assertResponseStatus(status.HTTP_400_BAD_REQUEST)

        for phoneNumber in ['', 'abcdefghij', '0', '123456789', '000000000a', '00000000000']:
            self.data['phoneNumber'] = phoneNumber
            self.assertResponseStatus(status.HTTP_400_BAD_REQUEST, f"{phoneNumber} should not be a valid phone number")

    def assertResponseStatus(self, expectedStatusCode, message = ''):
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, expectedStatusCode, message)