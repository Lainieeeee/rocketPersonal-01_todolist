// ============================================
// 定義共用的 API URL
// 讓後面的程式碼就能夠統一使用這個 URL 來發送請求
// ============================================
const apiUrl = "https://todoo.5xcamp.us";


// ============================================
// 共用錯誤處理函式
// ============================================
function handleError(error, message) {
    console.error(error);
    alert(message);
}

// ============================================
// 註冊帳號 POST(https://todoo.5xcamp.us/users)
// ============================================
// 定義「註冊帳號」按鈕變數
const signUpBtn = document.getElementById("signUpBtn");
// 點擊「註冊帳號」按鈕時，執行這裡
if (signUpBtn) {
    signUpBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        // <form> 裡，按鈕 (button) 預設是「提交 (submit)」，按下後會讓整個頁面重新整理，導致後面的 JavaScript 無法正常執行
        e.preventDefault();

        // 1. 取得表單輸入內容
        const email = document.getElementById("email").value;
        const nickname = document.getElementById("name").value;
        const password = document.getElementById("password").value;
        const password02 = document.getElementById("password02").value;

        // 2. 檢查輸入欄位是否空
        if (!email || !nickname || !password || !password02) {
            return alert("所有欄位都必須填寫！");
        }

        // 3. 檢查兩個密碼是否一致。如果不一樣，顯示錯誤訊息。
        if (password !== password02) {
            return alert("密碼不一致");
        }

        // 4. 如果輸入正確，執行以下操作
        try {
            // 4-1. 使用 POST 提交資料送到伺服器
            const response = await fetch(`${apiUrl}/users`, {
                method: "POST", // 使用 POST 方法來提交資料
                headers: { "Content-Type": "application/json" },  // 告訴伺服器請求的內容是 JSON
                body: JSON.stringify({ user: { email, nickname, password } })  // 請求的 body 是 JSON 格式的字串
            });

            // 4-2. 從伺服器回傳的資料改成 JSON 格式
            const result = await response.json();

            // 4-3. 根據伺服器回應的狀況處理
            if (response.ok) {
                alert("註冊成功！"); // 如果伺服器回應成功，顯示成功訊息
                window.location.href = "index.html";  // 跳轉到登入頁面
            } else {
                alert(`註冊失敗: ${result.error}`);  // 如果伺服器回應失敗，顯示錯誤訊息
            }
        } catch (error) {
            console.error(error);  // 顯示錯誤訊息到控制台
            alert("註冊時發生錯誤");  // 顯示錯誤提示
        }
    });
}

// ============================================
// 登入 POST(https://todoo.5xcamp.us/users/sign_in)
// ============================================
// 定義「登入」按鈕變數
const loginBtn = document.getElementById("loginBtn");
// 點擊「登入」按鈕時，執行這裡
if (loginBtn) {
    loginBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        // <form> 裡，按鈕 (button) 預設是「提交 (submit)」，按下後會讓整個頁面重新整理，導致後面的 JavaScript 無法正常執行
        e.preventDefault();

        // 1. 從表單取得輸入的資訊
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // 2. 檢查輸入欄位是否空
        if (!email || !password) {
            return alert("Email 或者密碼未輸入");
        }

        // 3. 如果輸入正確，執行以下操作
        try {
            // 3-1. 使用 POST 提交資料送到伺服器
            const response = await fetch(`${apiUrl}/users/sign_in`, {
                method: "POST", // 使用 POST 方法來提交資料
                headers: { "Content-Type": "application/json" },  // 告訴伺服器請求的內容是 JSON
                body: JSON.stringify({ user: { email, password } })  // 請求的 body 是 JSON 格式的字串
            });

            // 3-2. 從伺服器回傳的資料改成 JSON 格式
            const result = await response.json();

            // 3-3. 根據伺服器回應的狀況處理
            if (response.ok) {
                console.log("登錄成功！"); // 如果伺服器回應成功，顯示成功訊息

                // 取得token資料(如果登錄成功，API會回傳 token)
                const token = response.headers.get("Authorization");  // 從伺服器回應的 headers 中取得 token
                const expires = new Date(); // 創建一個新的日期物件
                expires.setTime(expires.getTime() + (1 * 60 * 60 * 1000)); // 設定token的過期時間為1小時
                document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`; // token存到cookie時，設置過期時間

                window.location.href = "toDoList.html";  // 跳轉到toDoList頁面

            } else {
                alert(`登錄失敗: ${result.error}`);  // 如果伺服器回應失敗，顯示錯誤訊息
            }
        } catch (error) {
            console.error(error);  // 顯示錯誤訊息到控制台
            alert("登錄時發生錯誤");  // 顯示錯誤提示
        }
    });
}

// ============================================
// 取出 Cookie 函數
// ============================================
function getCookie(name) {
    // 分割所有 cookies
    const cookies = document.cookie.split("; ");
    // 查找並返回指定的 cookie 值
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    // 如果找不到指定的 cookie，則返回 null
    return null;
}

// ============================================
// 刪除 Cookie 函數
// ============================================
function deleteCookie(name) {
    // 設定過期時間為過去，這樣 Cookie 就會被刪除(設定:1970/01/01(Thu) 00:00:00)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ============================================
// 登出 DELETE(https://todoo.5xcamp.us/users/sign_out)
// ============================================
// 定義「登出」按鈕變數
const logoutBtn = document.getElementById("logoutBtn");
// 點擊「登出」按鈕時，執行這裡
if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        // <form> 裡，按鈕 (button) 預設是「提交 (submit)」，按下後會讓整個頁面重新整理，導致後面的 JavaScript 無法正常執行
        e.preventDefault();

        // 1. 從cookie取得token
        const token = getCookie("token");

        // 2. 檢查token是否沒有
        if (!token) {
            alert("尚未登入，無法登出");
            return;
        }

        // 3. 發送請求到伺服器，執行以下操作
        try {
            // 3-1. 使用 DELETE 請求資料送到伺服器
            const response = await fetch(`${apiUrl}/users/sign_out`, {
                method: "DELETE", // 使用 DELETE 方法來提交資料
                headers: {
                    "Content-Type": "application/json",  // 告訴伺服器請求的內容是 JSON
                    "Authorization": `${token}`  // 傳送用戶的 token 來驗證請求（注意這裡不需要 Bearer 字串，伺服器只要驗證單純的 token 值）
                }
            });

            // 3-2. 從伺服器回傳的資料改成 JSON 格式
            const result = await response.json();

            // 3-3. 根據伺服器回應的狀況處理
            if (response.ok) {
                console.log("登出成功！");

                deleteCookie("token");  // 削除token

                window.location.href = "index.html";  // 跳轉到登入頁面
            } else {
                alert(`登出失敗: ${result.message}`);
            }
        } catch (error) {
            console.error(error);  // 顯示錯誤訊息到控制台
            alert("登出時發生錯誤");  // 顯示錯誤提示
        }
    });
}

// ============================================
// 訪問 toDoList.html 時，檢查是否有 token
// ============================================
if (window.location.pathname === "/toDoList.html") {
    // 1. 從cookie取得token
    const token = getCookie("token");
    // 2. 如果沒有token就跳轉到登入頁面
    if (!token) {
        window.location.href = "index.html";
    }
}







// ============================================
// 初始化隱藏元素並渲染待辦事項
// ============================================
// 1. 初始狀態隱藏元素
const emptyMessage = document.querySelector(".empty");
const listBox = document.querySelector(".listBox");
emptyMessage.classList.add("hidden");
listBox.classList.add("hidden");
// 2. 渲染待辦事項到畫面上
function renderTodos(todos) {

    const todoList = document.getElementById("todoList"); // 取得列表的元素

    todoList.innerHTML = ""; // 先清空列表

    if (todos.length === 0) {
        // 如果待辦事項沒有，執行以下操作
        emptyMessage.classList.remove("hidden");
        listBox.classList.add("hidden");
    } else {
        // 如果待辦事項有，執行以下操作
        todos.forEach(todo => {
            const li = document.createElement("li");
            li.classList.add("flex", "justify-start", "items-center", "mx-6", "py-4", "border-b", "border-[#E5E5E5]");
            const label = document.createElement("label");
            label.classList.add("w-[calc(100%-40px)]", "px-4");
            label.setAttribute("for", "");
            label.textContent = todo.content;
            li.appendChild(label);
            todoList.appendChild(li);
        });
        emptyMessage.classList.add("hidden");
        listBox.classList.remove("hidden");
    }
}

// ============================================
// 顯示TODO列表 GET(https://todoo.5xcamp.us/todos)
// ============================================
async function fetchTodos() {

    // 1. 從cookie取得token
    const token = getCookie("token");

    // 2. 確保 token 存在，沒有則中止函式
    try {
        // 2-1. 使用 GET 請求資料送到伺服器
        const response = await fetch(`${apiUrl}/todos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token  // 伺服器要求不需要 "Bearer "
            }
        });

        // 2-2. 檢查伺服器回應的狀態碼
        if (response.status === 401) {
            console.warn("未授權，請先登入");
            return;
        }

        // 2-3. 從伺服器回傳的資料改成 JSON 格式
        const result = await response.json();

        // 2-4. 判斷請求是否成功
        if (response.ok) {
            renderTodos(result.todos); // 成功後渲染畫面
        } else {
            alert(`取得待辦事項失敗: ${result.message}`);
        }
    } catch (error) {
        handleError(error, "無法取得待辦事項");
    }
}
// 頁面載入時，取得待辦事項
document.addEventListener("DOMContentLoaded", fetchTodos);

// ============================================
// 新增 TODO POST(https://todoo.5xcamp.us/todos)
// ============================================
// 定義「新增」按鈕變數
const addBtn = document.getElementById("addBtn");
// ??
if (addBtn) {
    addBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        // <form> 裡，按鈕 (button) 預設是「提交 (submit)」，按下後會讓整個頁面重新整理，導致後面的 JavaScript 無法正常執行
        e.preventDefault();  // 停止表單的預設提交行為

        // 1. 從cookie取得token
        const token = getCookie("token");

        // 2. 從表單取得輸入的資訊
        const content = document.getElementById("inputContent").value;

        // 3. 入力チェック
        if (!content) {
            alert("請輸入內容");
            return;
        }

        // 4. ??
        try {

            // 4-1. ??
            const response = await fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ todo: { content } })
            });

            // 4-2. 從伺服器回傳的資料改成 JSON 格式
            const result = await response.json();

            // 4-3. 根據伺服器回應的狀況處理
            if (response.ok) {
                console.log("新增成功！");
                await fetchTodos();
                const contentInput = document.getElementById("inputContent");
                if (contentInput) {
                    contentInput.value = "";
                } else {
                    console.error("未找到輸入欄位");
                }
            } else {
                console.error("新增失敗:", result);
            }
        } catch (error) {
            handleError(error, "新增時發生錯誤");
        }
    });
}