// ============================================
// 共用 變數
// ============================================
// API URL
const apiUrl = "https://todoo.5xcamp.us";

// ============================================
// 共用 helper function
// ============================================
// 錯誤處理
function handleError(error, message) {
    console.error(error);
    alert(message);
}
// module export export import
// 刪除Cookie
function deleteCookie(name) {
    // 設定過期時間為過去，這樣 Cookie 就會被刪除(設定:1970/01/01(Thu) 00:00:00)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
// 取出Cookie
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
// 註冊功能 POST
// ============================================
const signUpBtn = document.getElementById("signUpBtn");
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

        // 5. 檢查密碼長度和格式
        const passwordPattern = /^[a-zA-Z0-9]+$/;  // 英数字のみを許可
        if (password.length < 6) {
            return alert("密碼必須至少6個字元");
        }
        if (!passwordPattern.test(password)) {
            return alert("密碼只能包含英文字母和數字");
        }

        // 6. 電子郵件格式是否正確
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return alert("請輸入有效的電子郵件地址！");
        }

        // 7. 如果輸入正確，執行以下操作
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
            handleError(error, "註冊時發生錯誤");
        }
    });
}

// ============================================
// 登入功能 POST
// ============================================
const loginBtn = document.getElementById("loginBtn");
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
            handleError(error, "登錄時發生錯誤");
        }
    });
}

// ============================================
// 登出功能 DELETE
// ============================================
const logoutBtn = document.getElementById("logoutBtn");
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
            handleError(error, "登出時發生錯誤");
        }
    });
}

// ============================================
// 沒有token，無法訪問toDoList.html (=跳轉登入頁)
// ============================================
// 取得現在路徑
const path = window.location.pathname;
// 判斷是否為 本地環境 或 GitHub Pages 環境
if (path.endsWith("/toDoList.html")) {
    // 1. 從cookie取得token
    const token = getCookie("token");
    // 2. 如果沒有token就跳轉到登入頁面
    if (!token) {
        window.location.href = "index.html";
    }
}












// ============================================
// 新增(建立)ToDo POST
// ============================================
// 定義「新增ToDo」按鈕變數
const addBtn = document.getElementById("addBtn");
if (addBtn) {
    // 點擊「新增ToDo」按鈕時，執行這裡
    addBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        e.preventDefault();

        // 1. 從cookie取得token資料（=API需要知道是誰要新增toDo）
        const token = getCookie("token");
        // 2. 取得輸入欄位的內容
        const content = document.getElementById("inputContent").value;

        // 3. 檢查輸入欄位是否空
        if (!content) {
            alert("請輸入內容");
            return;
        }

        // 4. 如果輸入正確，執行以下操作
        try {
            // 2-1. 使用 POST 提交資料送到伺服器
            const response = await fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // 告訴給伺服器，提交的內容是 JSON
                    "Authorization": token  // 告訴給伺服器，哪個用戶正在發送請求
                },
                body: JSON.stringify({ todo: { content } })
            });

            // 2-2. 從伺服器回傳的資料改成 JSON 格式
            const result = await response.json();

            // 2-3. 根據伺服器回應的狀況處理
            if (response.ok) {
                console.log("新增成功！");
                await fetchTodos(); // 執行讀取ToDo列表
                const contentInput = document.getElementById("inputContent"); // 取得輸入欄位的元素
                if (contentInput) {
                    contentInput.value = ""; // 新增成功後，清空輸入欄位
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

// ============================================
// 讀取ToDo GET
// ============================================
async function fetchTodos() {

    // 1. 從cookie取得token資料（=API需要知道是誰要讀取toDo）
    const token = getCookie("token");

    // 2. 如果取得token，執行以下操作
    try {
        // 2-1. 使用 GET 請求資料送到伺服器
        const response = await fetch(`${apiUrl}/todos`, {
            method: "GET",
            headers: {
                "Authorization": token  // 告訴給伺服器，哪個用戶正在發送請求
            }
        });

        // 2-2. 檢查取得token是否有效的（例如：期限過期）
        if (response.status === 401) {
            console.warn("未授權，請先登入");
            return;
        }

        // 2-3. 從伺服器回傳的資料改成 JSON 格式
        const result = await response.json();

        // 2-4. 根據伺服器回應的狀況處理
        if (response.ok) {
            renderTodos(result.todos); // 成功後渲染畫面
        } else {
            alert(`取得待辦事項失敗: ${result.message}`);
        }
    } catch (error) {
        handleError(error, "無法取得待辦事項");
    }
}
document.addEventListener("DOMContentLoaded", fetchTodos);

// ============================================
// 修改ToDo PUT(更新整筆資料)
// ============================================
async function updateTodo(id, newContent) {

    // 1. 從cookie取得token資料（=API需要知道是誰要修改toDo）
    const token = getCookie("token");

    // 2. 如果取得token，執行以下操作
    try {
        // 2-1. 使用 PUT 提交資料送到伺服器
        const response = await fetch(`${apiUrl}/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",  // 告訴給伺服器，請求的內容是 JSON
                "Authorization": token  // 告訴給伺服器，哪個用戶正在發送請求
            },
            body: JSON.stringify({ todo: { content: newContent } })
        });

        // 2-3. 從伺服器回傳的資料改成 JSON 格式
        const result = await response.json();

        // 2-4. 根據伺服器回應的狀況處理
        if (response.ok) {
            console.log("更新成功！");
            await fetchTodos(); // 執行讀取ToDo列表
        } else {
            alert(`更新待辦事項失敗: ${result.message}`);
        }
    } catch (error) {
        handleError(error, "更新時發生錯誤");
    }
}

// ============================================
// 刪除ToDo DELETE
// ============================================
async function deleteTodo(id) {

    // 1. 從cookie取得token資料（=API需要知道是誰要刪除toDo）
    const token = getCookie("token");

    // 2. 如果取得token，執行以下操作
    try {
        // 2-1. 使用 DELETE 請求資料送到伺服器
        const response = await fetch(`${apiUrl}/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token  // 告訴給伺服器，哪個用戶正在發送請求
            },
        });

        // 2-2. 根據伺服器回應的狀況處理
        if (response.ok) {
            console.log("刪除成功！");
            await fetchTodos(); // 執行讀取ToDo列表
        } else {
            const result = await response.json();
            alert(`刪除失敗: ${result.message}`);
        }
    } catch (error) {
        handleError(error, "刪除時發生錯誤");
    }
}

// ============================================
// 待完成/已完成切換ToDo PATCH(部分更新)
// ============================================
async function toggleTodoCompletion(id, newCompletedState) {

    // 1. 從cookie取得token資料（=API需要知道是誰要切換toDo狀態）
    const token = getCookie("token");

    // 2. 如果取得token，執行以下操作
    try {
        // 2-1. 使用 PATCH 請求資料送到伺服器
        const response = await fetch(`${apiUrl}/todos/${id}/toggle`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",  // 告訴給伺服器，請求的內容是 JSON
                "Authorization": token  // 告訴給伺服器，哪個用戶正在發送請求
            },
            body: JSON.stringify({ todo: { completed: newCompletedState } })
        });

        // 2-2. 從伺服器回傳的資料改成 JSON 格式
        const result = await response.json();

        // 2-3. 根據伺服器回應的狀況處理
        if (response.ok) {
            console.log("完成状態更新成功！");
            await fetchTodos(); // 執行讀取ToDo列表
        } else {
            alert(`完成狀態更新失敗: ${result.message}`);
        }
    } catch (error) {
        handleError(error, "完成狀態更新時發生錯誤");
    }
}








// ============================================
// 顯示 ToDo 列表
// ============================================
// 取得元素並隱藏空訊息與列表區塊
const emptyMessage = document.querySelector(".empty");
const listBox = document.querySelector(".listBox");
emptyMessage.classList.add("hidden"); // 隱藏空訊息
listBox.classList.add("hidden"); // 隱藏列表區塊
// 顯示 ToDo 列表
function renderTodos(todos) {

    // 1. 取得列表元素和計數元素
    const todoList = document.getElementById("todoList");
    const todoCount = document.getElementById("todoCount");

    // 2. 先清空列表
    todoList.innerHTML = "";

    // 3. 根據oDo項目是否存在，執行以下操作
    if (todos.length === 0) {
        emptyMessage.classList.remove("hidden"); // 顯示空訊息
        listBox.classList.add("hidden"); // 隱藏列表區塊
    } else {
        emptyMessage.classList.add("hidden"); // 隱藏空訊息
        listBox.classList.remove("hidden"); // 顯示列表區塊

        // 迴圈每個ToDo項目
        todos.forEach(todo => {
            const li = createTodoItem(todo); // 創建ToDo項目
            const inputField = li.querySelector('input[type="text"]');

            // 已完成的項目加上 'completed' 類別
            if (todo.completed_at !== null) {
                li.classList.add("completed");
                inputField.classList.add("line-through", "text-secondary");
            }

            // 加入到列表中
            todoList.appendChild(li);
        });
    }

    // 4. 更新未完成列表的數量
    if (todoCount) {
        const incompleteTodos = todos.filter(todo => todo.completed_at === null);
        todoCount.textContent = incompleteTodos.length;
    }

    // 5. 取得當前選中的篩選條件
    const activeFilter = document.querySelector(".tabItems.active")?.getAttribute("data-filter") || "all";
    filterTodos(activeFilter);

}

// ============================================
// 每個 ToDo 項目(li)
// ============================================
// 創建每個 ToDo 項目(li)
function createTodoItem(todo) {

    // 1. 設置 ToDo 項目的列表項目 (li)
    const li = document.createElement("li");
    li.classList.add("panel", "flex", "justify-start", "items-center", "mx-6", "py-4", "border-b", "border-silver");
    li.setAttribute("data-id", todo.id);

    // 2. 附加勾選框 (checkbox)
    createTaskCheckBox(todo, li);

    // 3. 附加輸入框 (input)
    const label = document.createElement("label");
    label.classList.add("w-[calc(100%-40px)]", "px-4");
    const input = createInputField(todo);
    label.appendChild(input);
    li.appendChild(label);

    // 4. 附加刪除按鈕
    const deleteButton = createDeleteButton(todo, li);
    li.appendChild(deleteButton);

    // 5. 滑鼠進入/離開列表項目時，顯示或隱藏刪除按鈕
    li.addEventListener("mouseenter", () => deleteButton.classList.remove("hidden"));
    li.addEventListener("mouseleave", () => deleteButton.classList.add("hidden"));

    // 6. 返回創建的 ToDo 項目 (li)
    return li;
}

// ============================================
// 每個 ToDo 項目輸入欄位功能
// ============================================
// 為每個 ToDo 項目創建輸入框，並修改時執行以下操作
function createInputField(todo) {

    // 1. 製作「輸入框」
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("w-full");
    input.value = todo.content;

    // 2. 點擊「輸入框」後，執行以下操作
    input.addEventListener("click", (e) => {
        e.target.disabled = false; // 讓輸入框可以編輯
        e.target.focus(); // 焦點設置到輸入框
    });

    // 3. 修改輸入內容的處理
    const handleInput = async (e) => {

        // 去除前後的空白
        const newContent = e.target.value.trim();

        if (!newContent) {
            alert("內容不能為空！");
            e.target.value = todo.content; // 恢復原來的輸入內容
        } else if (newContent !== todo.content) {
            e.target.disabled = true;
            await updateTodo(todo.id, newContent); // 更新輸入內容
        }
    };

    // 3-1. 按下Enter鍵時的處理
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // 停止表單的預設行為
            handleInput(e);
        }
    });

    // 3-2. 當失去焦點(focus)時的處理
    input.addEventListener("blur", handleInput);

    // 4. 返回輸入框元素
    return input;
}

// ============================================
// 勾選功能
// ============================================
// 為每個 ToDo 項目創建checkbox，並點擊時執行以下操作
function createTaskCheckBox(todo, li) {

    // 1. 製作「checkbox」
    const taskCheck = document.createElement("input");
    taskCheck.type = "checkbox";
    taskCheck.id = "taskcheck";
    taskCheck.classList.add("w-[20px]", "h-[20px]", "cursor-pointer", "appearance-none", "bg-white", "rounded-sm", "relative", "border", "border-secondary");

    // 2. 已完成的項目加上 'checked' 類別
    if (todo.completed_at !== null) {
        taskCheck.classList.add("checked");
        taskCheck.checked = true;
    }

    // 3. 勾選框被點擊時，執行以下操作
    taskCheck.addEventListener("change", async () => {
        const newCompletedState = taskCheck.checked;  // 取消勾選「已完成狀態」
        await toggleTodoCompletion(todo.id, newCompletedState);  // 更新到伺服器
    });

    // 4. 追加checkbox至li
    li.appendChild(taskCheck);
}

// ============================================
// 刪除功能
// ============================================
// 為每個 ToDo 項目創建刪除按鈕，並點擊時執行以下操作
function createDeleteButton(todo, li) {

    // 1. 製作「刪除」按鈕
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("w-[20px]", "hover:opacity-75", "duration-300", "leading-4", "delete", "hidden");
    deleteButton.innerHTML = '<i class="fa-solid fa-xmark text-2xl"></i>';

    // 2. 點擊「刪除」按鈕時，執行以下操作
    deleteButton.addEventListener("click", async (e) => {
        e.stopPropagation();  // 點擊刪除按鈕時，只刪除該項目（ = 避免影響到外層的 <ul>）
        await deleteTodo(todo.id);  // 執行從伺服器刪除該ToDo
        li.remove();  // DOM也要立即更新刪除項目
    });

    // 3. 返回刪除按鈕
    return deleteButton;
}

// 取得(篩選)已完成項目
function getCompletedTodos() {
    return Array.from(document.querySelectorAll("li")).filter(function (item) {
        const checkbox = item.querySelector("input[type='checkbox']");
        return checkbox && checkbox.checked;
    });
}
// 點擊「清除已完成項目」按鈕時，執行以下操作
const deleteCompletedBtn = document.getElementById("deleteCompletedBtn");
deleteCompletedBtn.addEventListener("click", async function () {

    const completedTodos = getCompletedTodos(); // 取得(篩選)已完成項目

    // 確認有已完成的項目
    if (completedTodos.length > 0) {

        // 取得的陣列中的每個已完成項目ID，並回傳 data-id 屬性值
        const todoIds = completedTodos.map(function (item) {
            return item.getAttribute("data-id");
        });

        // 送出刪除請求
        await Promise.all(todoIds.map(function (id) {
            return deleteTodo(id);
        }));

        // DOM也要移除所有已完成的項目
        completedTodos.forEach(function (item) {
            item.remove();
        });
    }
});





// ============================================
// 篩選 ToDo 項目
// ============================================
const tabs = document.querySelectorAll(".tabItems");
// 取得所有篩選按鈕（全部、待完成、已完成）
tabs.forEach(tab => {
    tab.addEventListener("click", async function () {

        // 1. 取得篩選按鈕類別
        const filter = tab.getAttribute("data-filter");

        // 2. 先重新獲取最新的 ToDo 列表
        await fetchTodos();

        // 3. 根據篩選條件顯示 ToDo 項目
        filterTodos(filter);

        // 4. 更新按鈕樣式
        tabs.forEach(t => t.classList.remove("border-black","active"));
        tabs.forEach(t => t.classList.add("border-silver"));
        tab.classList.add("border-black","active");
        tab.classList.remove("border-silver");

    });
});
// 根據篩選條件顯示/隱藏 ToDo 項目
function filterTodos(filter) {

    // 1. 取得所有 ToDo 項目（li）
    const todoListItems = document.querySelectorAll("#todoList li");

    // 2. 根據篩選條件顯示或隱藏 ToDo 項目
    todoListItems.forEach(item => {

        // 2-1. 判斷該項目是否已完成
        const isCompleted = item.classList.contains("completed");

        // 2-2. 根據篩選條件顯示或隱藏
        if (filter === "all" || (filter === "incomplete" && !isCompleted) || (filter === "completed" && isCompleted)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}