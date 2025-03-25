// ============================================
// 定義共用的 API URL
// 讓後面的程式碼就能夠統一使用這個 URL 來發送請求
// ============================================
const apiUrl = "https://todoo.5xcamp.us";

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
                headers: { "Content-Type": "application/json" },  // 設定請求的內容類型為 JSON
                body: JSON.stringify({ user: { email, nickname, password } })  // 使用者輸入的資料轉換為 JSON 格式，並放在body
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
                headers: { "Content-Type": "application/json" },  // 設定請求的內容類型為 JSON
                body: JSON.stringify({ user: { email, password } })  // 使用者輸入的資料轉換為 JSON 格式，並放在body
            });
    
            // 3-2. 從伺服器回傳的資料改成 JSON 格式
            const result = await response.json();

            // 3-3. 根據伺服器回應的狀況處理
            if (response.ok) {
                console.log("登錄成功！"); // 如果伺服器回應成功，顯示成功訊息

                // 取得token資料
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