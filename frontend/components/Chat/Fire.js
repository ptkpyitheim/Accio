import firebase from 'firebase'; // 4.8.1


class Fire {

    constructor() {
        this.init();
        this.observeAuth();
        this.state = {
            messageId: 'hi'
        }
    }

    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyC4KEMboBFlVrPxLnSBkm9g5Ym44sgUjpg",
                authDomain: "cse438-5fa7f.firebaseapp.com",
                databaseURL: "https://cse438-5fa7f.firebaseio.com",
                projectId: "cse438-5fa7f",
                storageBucket: "cse438-5fa7f.appspot.com",
                messagingSenderId: "574907112985",
                appId: "1:574907112985:web:fb21f8c47550d9bfa19488",
                measurementId: "G-NGMJKM09KT"
            });
        }
    };


    observeAuth = () =>
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
            try {
                firebase.auth().signInAnonymously();
            } catch ({ message }) {
                alert(message);
            }
        }
    };

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get ref() {
        return firebase.database().ref(this.state.messageId);
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    on = callback =>
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    // send the message to the Backend
    setId = something => {
        this.state.messageId = something
    }
    send = messages => {
        // console.log(messages)
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                timestamp: this.timestamp,
            };
            this.append(message);
        }
    };

    append = message => firebase.database().ref(this.state.messageId).push(message);

    // close the connection to the Backend
    off() {
        this.ref.off();
    }
}

Fire.shared = new Fire();
export default Fire;
