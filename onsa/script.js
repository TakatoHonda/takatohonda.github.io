window.onload = function() {
    console.log(fabric);

    const canvas = new fabric.Canvas('c');
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // レイヤーリストの更新
    function updateLayers() {
        const layersList = document.getElementById('layersList');
        layersList.innerHTML = '';
        canvas.getObjects().forEach((obj, index) => {
            const li = document.createElement('li');
            li.className = 'layer-item';
            li.draggable = true;
            li.dataset.index = index;

            const icon = document.createElement('img');
            icon.className = 'layer-icon';

            if (obj.type === 'image') {
                // 画像オブジェクトの場合、サムネイルを生成
                const thumbnailCanvas = document.createElement('canvas');
                const thumbnailCtx = thumbnailCanvas.getContext('2d');
                const scale = Math.min(24 / obj.width, 24 / obj.height);
                thumbnailCanvas.width = obj.width * scale;
                thumbnailCanvas.height = obj.height * scale;
                thumbnailCtx.drawImage(obj._element, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
                icon.src = thumbnailCanvas.toDataURL();
            } else if (obj.type === 'text') {
                // テキストオブジェクトの場合、アイコンを設定
                icon.src = 'path/to/text-icon.png'; // テキストアイコンのパスを指定
            } else {
                icon.src = 'path/to/default-icon.png'; // その他のオブジェクトのデフォルトアイコン
            }
            li.appendChild(icon);

            const text = document.createElement('span');
            text.textContent = `${index + 1}: ${obj.type}`;
            li.appendChild(text);

            layersList.appendChild(li);
        });
    }

    // レイヤーのドラッグアンドドロップ
    let dragStartIndex;

    document.getElementById('layersList').addEventListener('dragstart', function(e) {
        dragStartIndex = e.target.closest('li').dataset.index;
        e.dataTransfer.effectAllowed = 'move';
    });

    document.getElementById('layersList').addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    document.getElementById('layersList').addEventListener('drop', function(e) {
        e.preventDefault();
        const dragEndIndex = e.target.closest('li').dataset.index;
        if (dragEndIndex !== undefined && dragStartIndex !== undefined) {
            const objects = canvas.getObjects();
            const temp = objects[dragStartIndex];
            objects[dragStartIndex] = objects[dragEndIndex];
            objects[dragEndIndex] = temp;
            canvas.clear();
            objects.forEach(obj => canvas.add(obj));
            canvas.renderAll();
            updateLayers();
        }
    });

    // ファイル入力イベントリスナー
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(f) {
                const data = f.target.result;
                console.log('File loaded:', data);
                fabric.Image.fromURL(data, function(img) {
                    const originalWidth = img.width;
                    const originalHeight = img.height;
                    const scaleFactor = Math.min(canvasWidth / originalWidth, canvasHeight / originalHeight);
                    img.scale(scaleFactor);
                    img.set({
                        left: 100,
                        top: 100,
                        angle: 0,
                        padding: 10,
                        cornersize: 10
                    });
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                    console.log('Image added to canvas');
                    updateLayers();
                });
            };
            reader.onerror = function(error) {
                console.error('Error reading file:', error);
            };
            reader.readAsDataURL(files[i]);
        }
    });

    // キャンバスの内容を保存する関数
    window.saveCanvas = function() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 0.8
        });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'collage.png';
        link.click();
    };

    // タッチイベントの追加（スマホ対応）
    canvas.on('touch:drag', function(options) {
        const obj = canvas.getActiveObject();
        if (obj) {
            const pointer = canvas.getPointer(options.e);
            obj.set({
                left: pointer.x,
                top: pointer.y
            });
            canvas.renderAll();
        }
    });

    // タッチイベントの追加（スマホ対応）
    document.getElementById('layersList').addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        dragStartIndex = touch.target.closest('li').dataset.index;
    });

    document.getElementById('layersList').addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    document.getElementById('layersList').addEventListener('touchend', function(e) {
        const touch = e.changedTouches[0];
        const dragEndIndex = document.elementFromPoint(touch.clientX, touch.clientY).closest('li').dataset.index;
        if (dragEndIndex !== undefined && dragStartIndex !== undefined) {
            const objects = canvas.getObjects();
            const temp = objects[dragStartIndex];
            objects[dragStartIndex] = objects[dragEndIndex];
            objects[dragEndIndex] = temp;
            canvas.clear();
            objects.forEach(obj => canvas.add(obj));
            canvas.renderAll();
            updateLayers();
        }
    });
};
