// qr.js

const QR = (() => {
    const qrReaderId = "qr-reader";

    const initializeQRScanner = () => {
        const qrReader = new Html5Qrcode(qrReaderId);
        const qrReaderResults = document.getElementById("qr-reader-results");

        // Verificar si ya está escaneando
        if (qrReader.getState() === Html5QrcodeScannerState.SCANNING) {
            return;
        }

        // Iniciar el escaneo
        qrReader.start(
            { facingMode: "environment" }, // Usar la cámara trasera
            {
                fps: 10,    // Cuadros por segundo
                qrbox: { width: 250, height: 250 } // Tamaño de la ventana del escáner
            },
            qrCodeSuccessCallback,
            qrCodeErrorCallback
        ).then(() => {
            console.log("Escáner iniciado.");
        }).catch(err => {
            console.log(`Error al iniciar el escáner: ${err}`);
            alert('No se pudo acceder a la cámara. Por favor, revisa los permisos y el dispositivo.');
        });
    };

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`Código QR detectado: ${decodedText}`);
        processQrCode(decodedText);
        stopScanner();
    };

    const qrCodeErrorCallback = (errorMessage) => {
        // Puedes manejar los errores de escaneo aquí si lo deseas
    };

    const processQrCode = (decodedText) => {
        /*
            Supongamos que el código QR contiene una cadena con el siguiente formato:
            Nombre:Producto A;Descripción:Descripción del Producto A;Cantidad:10;Precio:100.00;Límite:5
        */

        const productData = decodedText.split(';');
        const product = {};

        productData.forEach(item => {
            const [key, value] = item.split(':');
            if (key && value) {
                product[key.toLowerCase()] = value.trim();
            }
        });

        // Validar que se hayan obtenido todos los campos necesarios
        if (product.nombre && product.cantidad && product.límite) {
            // Completar el formulario con los datos del QR
            document.getElementById('product-name').value = product.nombre;
            document.getElementById('product-description').value = product.descripcion || '';
            document.getElementById('product-quantity').value = parseInt(product.cantidad);
            document.getElementById('product-price').value = parseFloat(product.precio) || '';
            document.getElementById('product-lowstock').value = parseInt(product.límite);

            alert('Producto agregado desde el QR. Por favor, revisa los detalles y presiona "Agregar Producto".');
        } else {
            alert('El código QR escaneado no contiene información válida del producto. Asegúrate de que siga el formato correcto.');
        }
    };

    const stopScanner = () => {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                const cameraId = devices[0].id;
                const qrReader = new Html5Qrcode(qrReaderId);
                qrReader.stop().then(ignore => {
                    console.log("Escáner detenido después de detectar un código.");
                }).catch(err => {
                    console.log(`Error al detener el escáner: ${err}`);
                });
            }
        }).catch(err => {
            console.log(`Error al obtener cámaras: ${err}`);
        });
    };

    return {
        initializeQRScanner
    };
})();
