let customerData = {
  accountID: 12345,
  firstName: 'Magnus',
  lastName: 'Engström',
  phoneNumber: '070-123 45 67',
  email: 'magnus@domain.com',
}

const avaibleFunctions = [
  {
    "name": "getCustomerData",
    "description": "Access the data describing the customer. Returns a JSON object containing the customer information.",
    "parameters": {
        "type": "object",
        "properties": {
            "accountID": {
                "type": "integer",
                "description": "The customer account ID.",
            },
        },
        "required": ["accountID"],
    },
  },
  {
    "name": "updatePhoneNumber",
    "description": "Update the customer's phone number.",
    "parameters": {
        "type": "object",
        "properties": {
            "newPhoneNumber": {
                "type": "string",
                "description": "The new phone number that will be used to update the customers contact information.",
            },
        },
        "required": ["newPhoneNumber"],
    },
  },
]
const getCustomerData = (accountID) => {
  if (customerData.accountID === accountID) {
    return JSON.stringify(customerData);
  }
  return null;
}

const updatePhoneNumber = (newPhoneNumber) => {
  customerData.phoneNumber = newPhoneNumber;
  return 'The phone number is updated';
}

export { getCustomerData, updatePhoneNumber, avaibleFunctions };