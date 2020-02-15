class Renderer {
    
    constructor() {
        this.authorized = false;
        this.publications = null;
    }

    authorization() {
        if (sessionStorage.getItem('authKey')) {
            socket.emit('autorizacia', {
                authKey: sessionStorage.getItem('authKey')
            }); 
        }
        let authForm = document.createElement('form');
        authForm.id = 'autorizacnyFormular';
        let authFieldset = document.createElement('fieldset');

        let authKey = document.createElement('input');
        authKey.id = 'key';
        authKey.type = 'password';

        let authLabel = document.createElement('label');
        authLabel.appendChild(document.createTextNode("Autorizačný kľúč: "));
        authLabel.appendChild(authKey);

        let authButton = document.createElement('button');
        authButton.id = "send";
        authButton.innerHTML = 'Over kľúč';
        authButton.addEventListener('click', (e) => {
            e.preventDefault();
            socket.emit('autorizacia', {
                authKey: authKey.value
            });             
        });

        authFieldset.appendChild(authLabel);
        authForm.appendChild(authFieldset);
        authForm.appendChild(authButton);

        let body = document.getElementsByTagName('body')[0];
        body.appendChild(authForm);

        socket.on('approved', () => {
            authKey.classList.remove("error");
            body.removeChild(authForm);
            if (!sessionStorage.getItem('authKey')){
                sessionStorage.setItem('authKey', authKey.value);
            }
            this.authorized = true;  
            let searchForm = new SearchForm(this.authorized);
            
            socket.on('searchedPublications', (data) => {
                if (this.publications == null) {
                    this.publications = new Publications(data);
                } else {
                    this.publications.render(data);
                }
                
            });
        });  

        socket.on('denied', () => {
            authKey.classList.add("error");
        }); 
    }
}