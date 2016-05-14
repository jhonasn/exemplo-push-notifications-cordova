//sender id: 873667141555
var app = {
    initialize: function() {
        app.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
        //$(document).on('deviceready', app.onDeviceReady); //num funfa!
    },
    onDeviceReady: function() {
        app.setInterfaceReady();
        app.registerDevice();
    },
    setInterfaceReady: function(id) {
        var parentElement = $('#deviceready');
        var listeningElement = parentElement.find('.listening').hide();
        var receivedElement = parentElement.find('.received').show();
    },
    registerDevice: function() {
        var statusPush = $('#status-push');

        var pushOptions = {
            android: {
                senderID: "873667141555"
            },
            ios: {},
            windows: {}
        };

        statusPush.text('inicializando...');
        var push = PushNotification.init(pushOptions);

        push.on('registration', function(data) {
            statusPush.text('registrando: ' + data.registrationId + '...');

            $.post('http://192.168.1.100:3000/api/registrar-dispositivo', {
            // $.post('http://172.16.249.226:3000/api/registrar-dispositivo', {
                    id: data.registrationId
                })
                .success(function() {
                    statusPush.text('registrado: ' + data.registrationId + '!');
                })
                .error(function(err) {
                    statusPush.text('erro: ' + err.status + ', ' + err.statusText);
                });
        });

        push.on('notification', function(data) {
            console.log(data.message);
            console.log(data.title);
            console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);

            alert('Notificação recebida - '
                .concat(data.title)
                .concat('\n\n')
                .concat(data.message)
            );
        });

        push.on('error', function(e) {
            statusPush.text('erro: ' + e.message);
            console.error(e.message);
        });

        // push.unregister(function() {
        //     push.off('notification');
        //     push.off('error');
        //
        //     //ajax para retirar a chave do aparelho do servidor
        // }, function() {
        //     console.error('erro ao desregistrar');
        // });
    }
};

app.initialize();
