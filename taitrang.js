// JavaScript Document
/* ==========================================
   VISITOR COUNTER
========================================== */

let visitors = localStorage.getItem("visitor_count");

if (visitors === null) {
    visitors = 1;
} else {
    visitors = parseInt(visitors) + 1;
}

localStorage.setItem("visitor_count", visitors);

const visitorCounter =
    document.getElementById("visitorCounter");

if (visitorCounter) {
    visitorCounter.innerText = visitors;
}

/* ==========================================
   PRODUCT DETAIL
========================================== */

let currentProduct = {
    name: "",
    price: "",
    description: ""
};

function showProduct(name, price, description) {

    currentProduct.name = name;
    currentProduct.price = price;
    currentProduct.description = description;

    document.getElementById("detailName").innerText =
        name;

    document.getElementById("detailPrice").innerText =
        price;

    document.getElementById("detailDesc").innerText =
        description;

    document
        .getElementById("detail")
        .scrollIntoView({
            behavior: "smooth"
        });
}

/* ==========================================
   AUTH SYSTEM
========================================== */

function getUsers() {
    const users = localStorage.getItem("jewelry_users");
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem("jewelry_users", JSON.stringify(users));
}

function getCurrentUser() {
    const user = localStorage.getItem("jewelry_current_user");
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem("jewelry_current_user", JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem("jewelry_current_user");
}

function updateAuthMenu() {
    const authLink = document.querySelector('.menu a[href="dangnhap.html"], .menu a[data-auth-link]');
    if (!authLink) return;

    const currentUser = getCurrentUser();
    if (currentUser) {
        authLink.innerHTML = `<span class="user-pill">Xin chào ${currentUser.name}</span><span class="logout-link">Đăng xuất</span>`;
        authLink.href = "#";
        authLink.onclick = function (e) {
            e.preventDefault();
            clearCurrentUser();
            updateAuthMenu();
            if (window.location.pathname.includes('dangnhap.html')) {
                window.location.reload();
            }
        };
    } else {
        authLink.innerHTML = 'Đăng Nhập';
        authLink.href = 'dangnhap.html';
        authLink.onclick = null;
    }
}

window.addEventListener('storage', function (event) {
    if (event.key === 'jewelry_current_user') {
        updateAuthMenu();
    }
});

function showAuthMessage(message, isError = false) {
    const target = document.getElementById('authMessage');
    if (!target) return;
    target.textContent = message;
    target.style.color = isError ? '#c0392b' : '#b9975b';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
        showAuthMessage('Email hoặc mật khẩu không đúng. Vui lòng thử lại.', true);
        return;
    }

    setCurrentUser({ name: user.name, email: user.email });
    showAuthMessage('Đăng nhập thành công!');
    updateAuthMenu();
    setTimeout(() => {
        window.location.href = 'index.HTML';
    }, 600);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        showAuthMessage('Vui lòng điền đầy đủ thông tin.', true);
        return;
    }

    const users = getUsers();
    const exists = users.some((item) => item.email === email);

    if (exists) {
        showAuthMessage('Email này đã tồn tại. Vui lòng dùng email khác.', true);
        return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    setCurrentUser({ name, email });
    showAuthMessage('Đăng ký thành công! Bạn đã được đăng nhập.');
    updateAuthMenu();
    setTimeout(() => {
        window.location.href = 'index.HTML';
    }, 600);
}

/* ==========================================
   CART SYSTEM
========================================== */

function getCart() {

    const cart =
        localStorage.getItem("jewelry_cart");

    return cart
        ? JSON.parse(cart)
        : [];
}

function saveCart(cart) {

    localStorage.setItem(
        "jewelry_cart",
        JSON.stringify(cart)
    );
}

function addToCart() {

    if (!currentProduct.name) {

        alert(
            "Vui lòng chọn sản phẩm trước."
        );

        return;
    }

    let cart = getCart();

    cart.push({
        name: currentProduct.name,
        price: currentProduct.price
    });

    saveCart(cart);

    renderCart();

    alert(
        "Đã thêm sản phẩm vào giỏ hàng."
    );
}

function parsePrice(value) {
    const numericValue = Number(String(value).replace(/[^\d]/g, ""));
    return Number.isNaN(numericValue) ? 0 : numericValue;
}

function formatPrice(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);
}

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");

    if (!cartItems) return;

    const cart = getCart();

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💎</div>
                <h3>Giỏ hàng hiện đang trống</h3>
                <p>Hãy chọn những món trang sức yêu thích để thêm vào đây.</p>
                <a href="sanpham.html" class="shop-link">Khám phá sản phẩm</a>
            </div>
        `;

        return;
    }

    let subtotal = 0;
    let html = `
        <div class="cart-layout">
            <div class="cart-list-card">
                <div class="cart-list-header">
                    <h3>Sản phẩm đã chọn</h3>
                    <span>${cart.length} món</span>
                </div>
    `;

    cart.forEach((item, index) => {
        const priceValue = parsePrice(item.price);
        subtotal += priceValue;

        html += `
            <div class="cart-item-card">
                <div class="cart-item-main">
                    <div class="cart-item-badge">✦</div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                    </div>
                </div>

                <div class="cart-item-actions">
                    <span class="cart-item-price">${formatPrice(priceValue)}</span>
                    <button
                        onclick="removeItem(${index})"
                        class="remove-btn">
                        Xóa
                    </button>
                </div>
            </div>
        `;
    });

    const total = subtotal;

    html += `
            </div>

            <div class="cart-summary-card">
                <h3>Tóm tắt đơn hàng</h3>
                <div class="summary-row">
                    <span>Tạm tính</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>
                <div class="summary-row">
                    <span>Phí vận chuyển</span>
                    <strong>Miễn phí</strong>
                </div>
                <div class="summary-row total-row">
                    <span>Tổng cộng</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <div class="summary-actions">
                    <button class="clear-cart-btn" onclick="clearCart()">
                        Xóa toàn bộ giỏ hàng
                    </button>
                    <button class="checkout-btn" onclick="placeOrder()">
                        Đặt hàng ngay
                    </button>
                </div>
            </div>
        </div>

        <div id="orderSuccess" class="order-success"></div>
    `;

    cartItems.innerHTML = html;
}

function removeItem(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();
}

function clearCart() {

    localStorage.removeItem(
        "jewelry_cart"
    );

    renderCart();
}

function placeOrder() {
    const cart = getCart();
    const currentUser = getCurrentUser();

    if (cart.length === 0) {
        alert("Giỏ hàng trống, vui lòng chọn sản phẩm trước khi đặt hàng.");
        return;
    }

    if (!currentUser) {
        alert("Bạn cần đăng nhập trước khi đặt hàng.");
        window.location.href = "dangnhap.html";
        return;
    }

    const orders = JSON.parse(localStorage.getItem("jewelry_orders") || "[]");
    orders.push({
        customer: currentUser.name,
        email: currentUser.email,
        items: cart,
        date: new Date().toLocaleString("vi-VN")
    });
    localStorage.setItem("jewelry_orders", JSON.stringify(orders));

    localStorage.removeItem("jewelry_cart");
    renderCart();

    const successBox = document.getElementById("orderSuccess");
    if (successBox) {
        successBox.innerHTML = `Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất. <br>Đơn hàng của bạn đã được lưu dưới tên ${currentUser.name}.`;
    }
}

/* ==========================================
   CHATBOT
========================================== */

const chatbot =
    document.getElementById("chatbot");

const chatToggle =
    document.getElementById("chatToggle");

if (chatToggle) {

    chatToggle.addEventListener(
        "click",
        function () {

            if (
                chatbot.style.display ===
                "block"
            ) {

                chatbot.style.display =
                    "none";

            } else {

                chatbot.style.display =
                    "block";
            }
        }
    );
}

function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );

    const chatBody =
        document.getElementById(
            "chat-body"
        );

    const message =
        input.value.trim();

    if (message === "") return;

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "user-message";

    userMessage.innerHTML =
        message;

    chatBody.appendChild(
        userMessage
    );

    let reply = getBotReply(
        message.toLowerCase()
    );

    setTimeout(() => {

        const botMessage =
            document.createElement(
                "div"
            );

        botMessage.className =
            "bot-message";

        botMessage.innerHTML =
            reply;

        chatBody.appendChild(
            botMessage
        );

        chatBody.scrollTop =
            chatBody.scrollHeight;

    }, 500);

    input.value = "";

    chatBody.scrollTop =
        chatBody.scrollHeight;
}

function getBotReply(text) {

    if (
        text.includes("xin chào") ||
        text.includes("hello")
    ) {

        return `
        Xin chào quý khách.
        Tôi có thể hỗ trợ về sản phẩm,
        giá cả và chính sách mua hàng.
        `;
    }

    if (
        text.includes("giá")
    ) {

        return `
        Các sản phẩm có giá từ
        5 triệu đến hơn 100 triệu VNĐ.
        `;
    }

    if (
        text.includes("kim cương")
    ) {

        return `
        Chúng tôi cung cấp
        kim cương thiên nhiên
        và kim cương kiểm định.
        `;
    }

    if (
        text.includes("bảo hành")
    ) {

        return `
        Chính sách bảo hành
        và làm mới sản phẩm
        trọn đời.
        `;
    }

    if (
        text.includes("liên hệ")
    ) {

        return `
        Hotline:
        0900 000 000
        `;
    }

    return `
    Xin lỗi,
    tôi chưa hiểu câu hỏi.
    `;
}

/* ==========================================
   ENTER SEND CHAT
========================================== */

const chatInput =
    document.getElementById(
        "chatInput"
    );

if (chatInput) {

    chatInput.addEventListener(
        "keypress",
        function (e) {

            if (e.key === "Enter") {

                sendMessage();
            }
        }
    );
}

function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const successMessage = form.querySelector('.contact-success-message');

    if (successMessage) {
        successMessage.textContent = 'Gửi ý kiến thành công. Cảm ơn bạn đã liên hệ!';
    }

    form.reset();
}

/* ==========================================
   SCROLL EFFECT HEADER
========================================== */

window.addEventListener(
    "scroll",
    function () {

        const header =
            document.querySelector(
                ".header"
            );

        if (
            window.scrollY > 80
        ) {

            header.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.08)";

        } else {

            header.style.boxShadow =
                "none";
        }
    }
);

/* ==========================================
   SMOOTH BUTTON HERO
========================================== */

const heroBtn =
    document.querySelector(
        ".hero-btn"
    );

if (heroBtn) {

    heroBtn.addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "products"
                )
                .scrollIntoView({
                    behavior:
                        "smooth"
                });
        }
    );
}

/* ==========================================
   AUTO LOAD CART
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderCart();
        updateAuthMenu();

        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const contactForms = document.querySelectorAll('.contact-form');

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        if (contactForms.length) {
            contactForms.forEach(form => {
                form.addEventListener('submit', handleContactSubmit);
            });
        }
    }
);