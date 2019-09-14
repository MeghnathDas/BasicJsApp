
var appCaption = document.getElementById("appCaption");
appCaption.innerText = document.title;


var inpId = document.getElementById('inpId');
var inpName = document.getElementById('inpName');
var inpPhone = document.getElementById('inpPhone');
var btnAddContact = document.getElementById('btnAddContact');
var btnReset = document.getElementById('btnReset');
var contactList = document.getElementById("contactList");
var btnAlertClose = document.getElementById("btnAlertClose");

btnAlertClose.addEventListener('click', () => {
    this.setError(null);
});

this.setError(null);

contactList.addEventListener('onRemoveRequest', (event) => {
    inpId.value = event.detail.id;
    var contactItem = getCurrentModifingItem();
    contactItem.parentNode.removeChild(contactItem);
});

contactList.addEventListener('onEditRequest', (event) => {
    inpId.value = event.detail.id;
    inpName.value = event.srcElement.parentNode.parentNode.dataset.name;
    inpPhone.value = event.srcElement.parentNode.parentNode.dataset.phoneno;
    btnAddContact.value = 'Modify';
    btnReset.value = 'Cancel';
    event.srcElement.disabled = true;
    event.srcElement.nextSibling.disabled = true;
});

btnAddContact.addEventListener('click', (event) => {
    if (inpName.value != '' && inpPhone.value != '') {
        if (this.isDuplicate(inpName.value,
            inpPhone.value,
            inpId.value === '' ? -1 : parseInt(inpId.value))) {
            this.setError('Duplicate values are not allowed');
            return;
        }

        var newContactItem = new contact(this.getNewId(), inpName.value, inpPhone.value).getElement();
        var contactItem = getCurrentModifingItem();
        if (contactItem) {
            contactItem.children[0].innerText = inpName.value + " - " + inpPhone.value;
            contactItem.children[1].children[0].disabled = false;
            contactItem.children[1].children[1].disabled = false;

            contactItem.dataset.name = inpName.value;
            contactItem.dataset.phoneno = inpPhone.value;
        } else {
            contactList.appendChild(newContactItem);
        }
        btnReset.click();
        this.setError(null);
    } else {
        this.setError('Please enter proper name and phone number');
    }
});

btnReset.addEventListener('click', (event) => {
    var contactItem = getCurrentModifingItem();
    if (contactItem) {
        contactItem.children[0].innerText = inpName.value + " - " + inpPhone.value;
        contactItem.children[1].children[0].disabled = false;
        contactItem.children[1].children[1].disabled = false;
    }
    inpName.value = '';
    inpPhone.value = '';
    inpId.value = '';
    btnAddContact.value = 'Add';
    btnReset.value = 'Reset';
    this.setError(null);
    inpName.focus();
});

function isDuplicate(name, phoneNo, id = -1) {
    if (contactList.children.length === 2) { return false; }

    var matchedItems = Array.from(contactList.children)
        .filter((htmlElm) => {
            var idData = htmlElm.dataset.id;
            var phoneNoData = htmlElm.dataset.phoneno;
            var nameData = htmlElm.dataset.name;
            if (phoneNoData) {
                if (name === nameData || phoneNo === phoneNoData) {
                    return id === -1 ? true : id != parseInt(idData);
                }
            }
        });

    return matchedItems.length > 0;
}

function getNewId() {
    if (contactList.children.length === 2) { return 1; }

    var latestID = Array.from(contactList.children)
        .map((contactDiv) => {
            return parseInt(contactDiv.dataset.id)
        })
        .filter((idData) => {
            if (idData) {
                if (idData > 0) {
                    return true;
                }
            }
        }).reduce((prev, current) => (prev.y > current.y) ? prev : current);

    return latestID + 1;
}

function getCurrentModifingItem() {
    if (!inpId.value) { return undefined; }
    if (inpId.value === '') { return undefined; }

    var contactItem = document.querySelector(`contact[data-id="${inpId.value}"]`);
    return contactItem;
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
    constructor(id, name, phoneNo) {
        this.id = id;
        this.name = name;
        this.phoneNo = phoneNo;
    }

    getElement = () => {
        var contactElement = document.createElement('contact');
        contactElement.classList.add('list-group-item');
        contactElement.classList.add('list-group-item-action');
        contactElement.classList.add('contact');
        contactElement.setAttribute('data-id', this.id)
        contactElement.setAttribute('data-name', this.name)
        contactElement.setAttribute('data-phoneno', this.phoneNo)
        var lblInfo = document.createElement('label');
        lblInfo.innerText = this.name + ' - ' + this.phoneNo;
        contactElement.appendChild(lblInfo);

        var actionAreaSpan = document.createElement('span');
        actionAreaSpan.classList.add('contact-item-action-area');

        var btnEdit = document.createElement('button');
        btnEdit.classList.add('btn');
        btnEdit.classList.add('btn-danger');
        btnEdit.classList.add('btn-xs');
        btnEdit.innerText = 'Edit';
        btnEdit.style.marginRight = '5px';
        actionAreaSpan.appendChild(btnEdit);
        var onEditRequestEvent = new CustomEvent('onEditRequest', {
            bubbles: true,
            detail: { id: this.id }
        });
        btnEdit.addEventListener('click', (event) => {
            event.srcElement.dispatchEvent(onEditRequestEvent);
            event.stopPropagation();
        });

        var btnRemove = document.createElement('button');
        btnRemove.classList.add('btn');
        btnRemove.classList.add('btn-primary');
        btnRemove.classList.add('btn-xs');
        btnRemove.innerText = 'Remove';
        actionAreaSpan.appendChild(btnRemove);
        var onRemoveRequest = new CustomEvent('onRemoveRequest', {
            bubbles: true,
            detail: { id: this.id }
        });
        btnRemove.addEventListener('click', (event) => {
            event.srcElement.dispatchEvent(onRemoveRequest);
            event.stopPropagation();
        });

        contactElement.appendChild(actionAreaSpan);

        return contactElement;
    };
}

