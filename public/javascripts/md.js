
var appCaption = document.getElementById("appCaption");
appCaption.innerText = document.title;

var btnAddContact = document.getElementById('btnAddContact');
var contactList = document.getElementById("contactList");
var btnAlertClose = document.getElementById("btnAlertClose");

btnAlertClose.addEventListener('click', () => {
    this.setError(null);
});

this.setError(null);

btnAddContact.addEventListener('click', (event) => {

    var inpName = document.getElementById('inpName');
    var inpPhone = document.getElementById('inpPhone');

    if (inpName.value != '' && inpPhone.value != '') {
        if (this.isDuplicate(inpName.value, inpPhone.value)) {
            this.setError('Duplicate values are not allowed');
            return;
        }

        var newContact = new contact(inpName.value, inpPhone.value);
        contactList.appendChild(newContact.getElement());
        inpName.value = '';
        inpPhone.value = '';
        inpName.focus();

        this.setError(null);
    } else {
        this.setError('Please enter proper name and phone number');
    }
});

function isDuplicate(name, phoneNo) {
    if (contactList.children.length === 2) { return false; }

    var matchedItems = Array.from(contactList.children)
                            .filter((htmlElm) => {
                                var phoneNoData = htmlElm.getAttribute('data-phoneno');
                                var nameData = htmlElm.getAttribute('data-name');
                                if (phoneNoData) {
                                    if (name === nameData || phoneNo === phoneNoData) {
                                        return true;
                                    }
                                }
                            });

    return matchedItems.length > 0;
}

function setError(message) {
    var alertBox = document.getElementById('contactEntryError');
    alertBox.style.display = 'none';

    if (message) {
        if (message != '') {
            var dvErrorMsg = alertBox.children[0];
            dvErrorMsg.innerText = message;
            alertBox.style.display = '';
        }
    }

    var contacts = Array.from(document.getElementsByClassName('contact'));
    contacts.forEach(element => {
        element.style.display = alertBox.style.display === '' ? 'none' : '';
    });
};

class contact {
    constructor(name, phoneNo) {
        this.name = name;
        this.phoneNo = phoneNo;
    }

    getElement = () => {
        var contactElement = document.createElement('div');
        contactElement.classList.add('list-group-item');
        contactElement.classList.add('list-group-item-action');
        contactElement.classList.add('contact');
        contactElement.setAttribute('href', '#')
        contactElement.setAttribute('data-name', this.name)
        contactElement.setAttribute('data-phoneno', this.phoneNo)
        contactElement.innerText = this.name + ' - ' + this.phoneNo;

        return contactElement;
    };
}

