let customerData = {
  accountID: 12345,
  firstName: 'Magnus',
  lastName: 'Engström',
  phoneNumber: '',
  email: 'magnus@domain.com',
}

const showReasoning = true;

const schema = [
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
          "reason": {
            "type": "string",
            "description": "The motivation and reason behind calling this function.",
          },
        },
        "required": ["accountID", "reason"],
    },
  },
  {
    "name": "updateContactInformation",
    "description": "Update the customer's contact information. The contact information can be updated as it is represented in the JSON object returned from getCustomerData()",
    "parameters": {
        "type": "object",
        "properties": {
          "field": {
              "type": "string",
              "description": "A contact information field as represented by the JSON object returned from getCustomerData().",
          },
          "value": {
            "type": "string",
            "description": "The new contact information for updating a contact field connected to an account.",
          },
          "reason": {
            "type": "string",
            "description": "The motivation and reason behind calling this function.",
          },
        },
        "required": ["field", "value", "reason"],
    },
  },
  {
    "name": "escalateIssue",
    "description": "Escalate an issue that cannot be handled using available information. The user must confirm the prefered way of contact before this function is called.",
    "parameters": {
      "type": "object",
      "properties": {
        "accountID": {
          "type": "integer",
          "description": "The customer account ID.",
        },
        "issue": {
          "type": "string",
          "description": "A description of the issue.",
        },
        "typeOfContact": {
          "type": "string",
          "enum": ["phone", "email"],
          "description": "The prefered way the customer would like to be contacted regarding this issue.",
        },
        "reason": {
          "type": "string",
          "description": "The motivation and reason behind calling this function.",
        },
      },
      "required": ["accountID", "issue", "typeOfContact", "reason"],
    },
  },
  {
    "name": "serviceStatus",
    "description": "A function that return a JSON object showing the current status of different services provided by the company.",
    "parameters": {
      "type": "object",
      "properties": {
        "accountID": {
          "type": "integer",
          "description": "The customer account ID.",
        },
        "reason": {
          "type": "string",
          "description": "The motivation and reason behind calling this function.",
        },
      },
      "required": ["accountID", "reason"],
  },
  },
]
const getCustomerData = (accountID, reason) => {
  console.log("\x1b[90m", 'I bakgrunden: Agenten hämtar kundens kontaktuppgifter.'); 
  logReasoning(reason);
  if (customerData.accountID === accountID) {
    return JSON.stringify(customerData);
  }
  return null;
}

const serviceStatus = (id, reason) => {
  console.log("\x1b[90m", 'I bakgrunden: Agenten hämtar statusinformation om tjänster och produkter.');
  logReasoning(reason);
  return JSON.stringify({
    'login': 'service is restricted on the website resulting in long response times.',
    'website': 'service is running and available',
    'mobile app': 'service is running and available',
    'print newspaper': 'arriving late due to snow storm',
  });
}

const escalateIssue = (accountID, issue, typeOfContact, reason) => {
  console.log("\x1b[90m", 'I bakgrumden: Agenten lägger ett ärende till en medarbetare.');
  logReasoning(reason);
  return 'The issue was registrered successfully';
}

const updateContactInformation = (field, value, reason) => {
  console.log("\x1b[90m", 'I bakgrunden: Agenten uppdaterar fält i kundens kontaktuppgifter.');
  logReasoning(reason);
  customerData[field] = value;
  return 'The contact information is updated';
}

const logReasoning = (reason) => {
  if (!showReasoning) return;
  console.log("\x1b[90m", 'Anledning:', reason);
}

export { getCustomerData, updateContactInformation, escalateIssue, serviceStatus, schema };