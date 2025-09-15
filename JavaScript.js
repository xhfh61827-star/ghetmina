(function () {
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const arena = document.getElementById('arena');
    const catImg = document.getElementById('cat-img'); // <img id="cat-img">

    let escapeCount = 0;
    const MAX_ESCAPES = 10; // số lần "Không" trốn được

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Di chuyển nút "Không"
    function moveNoButton() {
        const arenaRect = arena.getBoundingClientRect();
        const yesRect = btnYes.getBoundingClientRect();
        const noRect = btnNo.getBoundingClientRect();

        const padding = 8;
        const maxLeft = Math.max(0, arenaRect.width - noRect.width - padding);
        const maxTop = Math.max(0, arenaRect.height - noRect.height - padding);

        let left, top;
        for (let i = 0; i < 30; i++) {
            left = rand(padding, Math.round(maxLeft));
            top = rand(padding, Math.round(maxTop));
            const candidateRect = {
                left: arenaRect.left + left,
                right: arenaRect.left + left + noRect.width,
                top: arenaRect.top + top,
                bottom: arenaRect.top + top + noRect.height
            };
            const overlap = !(
                candidateRect.right < yesRect.left ||
                candidateRect.left > yesRect.right ||
                candidateRect.bottom < yesRect.top ||
                candidateRect.top > yesRect.bottom
            );
            if (!overlap) break;
        }
        btnNo.style.transform = `translate(${left}px, ${top}px)`;
    }

    // Xử lý khi chuột/nhấn vào nút "Không"
    function escapeHandler(e) {
        e.preventDefault();
        if (btnNo.dataset.removed === '1') return;

        escapeCount++;
        moveNoButton();

        arena.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-6px)' },
            { transform: 'translateY(0px)' }
        ], { duration: 260, easing: 'ease-out' });

        if (escapeCount >= MAX_ESCAPES) {
            setTimeout(() => {
                btnNo.classList.add('fade-out');
                btnNo.dataset.removed = '1';
                setTimeout(() => btnNo.style.display = 'none', 650);
            }, 180);
        }

        updateNoButtonText();
    }

    // Tăng size nút Yes mỗi lần
    function resizeYesButton() {
        const computedStyle = window.getComputedStyle(btnYes);
        const fontSize = parseFloat(computedStyle.getPropertyValue("font-size"));
        const newFontSize = fontSize * 1.2;
        btnYes.style.fontSize = `${newFontSize}px`;
    }

    // Câu chữ cho nút "Không"
    function generateMessage(noCount) {
        const messages = [
            "Ra là bạn ghét mình thật 🥲",
            "Đừng mà...",
            "Mình buồn lắm đó 😢",
            "Huhu 😭",
            "Thôi tha cho mình đi 🥹"
        ];
        const index = Math.min(noCount, messages.length - 1);
        return messages[index];
    }

    // Đổi ảnh mèo dựa vào escapeCount
    function changeImage() {
        let index = escapeCount;
        if (index > 9) index = 9; // chỉ cần đến cat-5.jpg là đủ
        catImg.src = `img/cat-${index}.jpg`;
    }

    // Cập nhật nội dung nút "Không"
    function updateNoButtonText() {
        btnNo.innerHTML = generateMessage(escapeCount);
        changeImage();
        resizeYesButton();
    }

    // Gắn sự kiện cho nút "Không"
    btnNo.addEventListener('mouseenter', escapeHandler);
    btnNo.addEventListener('click', escapeHandler);
    btnNo.addEventListener('touchstart', escapeHandler);

    // Nút "Đúng thế"
    btnYes.addEventListener('click', () => {
        document.querySelector('.title').innerHTML = "💖 Mình quý bạn nhiều lắm 💖";
        arena.classList.add("hidden");
        escapeCount = 9; // ép hiện ảnh đẹp nhất
        changeImage();
    });

})();
