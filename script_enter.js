// DOM elementleri
const menuButtons = document.querySelectorAll(".menu-btn");
const pages = document.querySelectorAll(".page");

// Takvim sayfası elemanları
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const monthYearDisplay = document.getElementById("month-year");
const calendarEl = document.getElementById("calendar");
const calendarWeekdaysEl = document.getElementById("calendar-weekdays");
const selectedDateHeader = document.getElementById("selected-date-header");
const tasksContainer = document.getElementById("tasks-container");
const todoListCalendar = document.getElementById("todo-list-calendar");
const completedListCalendar = document.getElementById("completed-list-calendar");
const taskInputCalendar = document.getElementById("task-input-calendar");
const addTaskBtnCalendar = document.getElementById("add-task-btn-calendar");

// Uygulama verisi
let appData = loadData();

// Takvim için seçili tarih
let calendarCurrent = new Date();
calendarCurrent.setDate(1);
let selectedDate = new Date();
selectedDate.setHours(0, 0, 0, 0);

// Başlangıçta aktif sayfa "calendar"
let activePage = "calendar";

init();

function init() {
  switchPage(activePage);
  renderCalendarWeekdays();
  renderCalendar();

  // Menü butonları tıklama olayı
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      activePage = page;
      switchPage(page);
    });
  });

  // Takvim butonları
  prevMonthBtn.addEventListener("click", () => {
    calendarCurrent.setMonth(calendarCurrent.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    calendarCurrent.setMonth(calendarCurrent.getMonth() + 1);
    renderCalendar();
  });

  // Takvimde tarih bazlı görev ekleme
  addTaskBtnCalendar.addEventListener("click", () => {
    const text = taskInputCalendar.value.trim();
    if (!text) {
      alert("Görev boş olamaz!");
      return;
    }
    addTask(selectedDate, text);
    taskInputCalendar.value = "";
    renderTasksForCalendar(selectedDate);
  });

  // Sayfa yüklendiğinde arşiv ve çöp kutusunu renderla
  renderArchive();
  renderTrash();
}

// Sayfa değiştirme fonksiyonu
function switchPage(pageName) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.id === `${pageName}-page`);
  });
  menuButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageName);
  });

  if (pageName === "calendar") {
    renderCalendar();
    renderTasksForCalendar(selectedDate);
    tasksContainer.style.display = "block";
    selectedDateHeader.style.display = "block";
  } else {
    tasksContainer.style.display = "none";
    selectedDateHeader.style.display = "none";
  }
}

// Haftanın gün isimlerini pazartesi başlangıçlı renderla
function renderCalendarWeekdays() {
  const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  calendarWeekdaysEl.innerHTML = "";
  weekdays.forEach((day) => {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell", "calendar-weekday");
    cell.textContent = day;
    calendarWeekdaysEl.appendChild(cell);
  });
}

// Takvimi render et
function renderCalendar() {
  monthYearDisplay.textContent = calendarCurrent.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  });
  calendarEl.innerHTML = "";

  const firstDay = new Date(calendarCurrent.getFullYear(), calendarCurrent.getMonth(), 1);
  const lastDay = new Date(calendarCurrent.getFullYear(), calendarCurrent.getMonth() + 1, 0);

  let firstWeekday = firstDay.getDay();
  firstWeekday = firstWeekday === 0 ? 7 : firstWeekday; // Pazar=7
  const emptyCells = firstWeekday - 1; // Pazartesi bazlı

  for (let i = 0; i < emptyCells; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-cell", "empty");
    calendarEl.appendChild(emptyCell);
  }

  const daysInMonth = lastDay.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell");
    cell.textContent = day;

    const cellDate = new Date(calendarCurrent.getFullYear(), calendarCurrent.getMonth(), day);
    if (isSameDate(cellDate, selectedDate)) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () => {
      selectedDate = new Date(cellDate);
      renderCalendar();
      renderTasksForCalendar(selectedDate);
      updateSelectedDateTexts();
    });

    calendarEl.appendChild(cell);
  }
  updateSelectedDateTexts();
}

// Görev ekleme fonksiyonu
function addTask(date, text) {
  if (!text) return;

  if (!appData.tasks) appData.tasks = {};
  if (!appData.archive) appData.archive = [];
  if (!appData.trash) appData.trash = [];

  if (date) {
    const key = formatDateKey(date);
    if (!appData.tasks[key]) appData.tasks[key] = [];
    if (appData.tasks[key].some(t => t.text === text && !t.deleted && !t.archived)) {
      alert("Aynı görev zaten mevcut.");
      return;
    }
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      archived: false,
      deleted: false,
    };
    appData.tasks[key].push(newTask);
  } else {
    if (!appData.tasks["general"]) appData.tasks["general"] = [];
    if (appData.tasks["general"].some(t => t.text === text && !t.deleted && !t.archived)) {
      alert("Aynı görev zaten mevcut.");
      return;
    }
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      archived: false,
      deleted: false,
    };
    appData.tasks["general"].push(newTask);
  }

  saveData(appData);
}

// Tarihli görevleri tarih bazlı getir (takvim için)
function getTasksByDate(date) {
  const key = formatDateKey(date);
  return appData.tasks[key] || [];
}

// Takvimde seçili tarihe göre görevleri göster
function renderTasksForCalendar(date) {
  todoListCalendar.innerHTML = "";
  completedListCalendar.innerHTML = "";

  const tasks = getTasksByDate(date);

  tasks
    .filter((t) => !t.completed && !t.archived && !t.deleted)
    .forEach((task) => {
      todoListCalendar.appendChild(createTaskItem(task, false));
    });

  tasks
    .filter((t) => t.completed && !t.archived && !t.deleted)
    .forEach((task) => {
      completedListCalendar.appendChild(createTaskItem(task, true));
    });

  updateSelectedDateTexts();
}

// Görev listesi öğesi oluştur (butonlarla)
function createTaskItem(task, isCompleted = false) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (isCompleted) li.classList.add("completed");
  li.textContent = task.text;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  if (!task.completed) {
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔️";
    completeBtn.title = "Tamamlandı olarak işaretle";
    completeBtn.addEventListener("click", () => toggleComplete(task));
    actions.appendChild(completeBtn);

    const archiveBtn = document.createElement("button");
    archiveBtn.textContent = "📦";
    archiveBtn.title = "Arşive taşı";
    archiveBtn.addEventListener("click", () => moveToArchive(task));
    actions.appendChild(archiveBtn);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Çöp kutusuna taşı";
  deleteBtn.addEventListener("click", () => moveToTrash(task));
  actions.appendChild(deleteBtn);

  li.appendChild(actions);
  return li;
}

// Görev tamamlandı toggle
function toggleComplete(task) {
  task.completed = !task.completed;
  saveData(appData);
  renderTasksForCalendar(selectedDate);
}

// Görev arşive taşı
function moveToArchive(task) {
  if (task.archived) return; // Zaten arşivde ise işlem yapma
  task.archived = true;
  appData.archive.push(task);

  for (const key in appData.tasks) {
    appData.tasks[key] = appData.tasks[key].filter(t => t.id !== task.id);
  }

  saveData(appData);
  renderTasksForCalendar(selectedDate);
  renderArchive();
}

// Görevi çöpe taşı
function moveToTrash(task) {
  if (task.deleted) return; // Zaten çöpte ise işlem yapma
  task.deleted = true;

  for (const key in appData.tasks) {
    appData.tasks[key] = appData.tasks[key].filter(t => t.id !== task.id);
  }

  // Arşivde ise arşivden de çıkar
  appData.archive = appData.archive.filter(t => t.id !== task.id);

  appData.trash.push(task);
  saveData(appData);

  renderTasksForCalendar(selectedDate);
  renderTrash();
}

// Arşiv sayfası render fonksiyonu
function renderArchive() {
  const archiveList = document.getElementById("archive-list");
  archiveList.innerHTML = "";
  appData.archive.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "↩️";
    restoreBtn.title = "Geri al";
    restoreBtn.addEventListener("click", () => {
      const index = appData.archive.findIndex(t => t.id === task.id);
      if (index > -1) appData.archive.splice(index, 1);
      task.archived = false;
      task.completed = false;

      // appData.tasks içine ekle (tarih bilgisi yoksa "general" olarak ekle)
      let added = false;
      for (const key in appData.tasks) {
        if (!appData.tasks[key].some(t => t.id === task.id)) {
          appData.tasks[key].push(task);
          added = true;
          break;
        }
      }
      if (!added) {
        if (!appData.tasks["general"]) appData.tasks["general"] = [];
        appData.tasks["general"].push(task);
      }

      saveData(appData);
      renderArchive();
      renderTasksForCalendar(selectedDate);
    });
    actions.appendChild(restoreBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Sil";
    deleteBtn.addEventListener("click", () => {
      const index = appData.archive.findIndex(t => t.id === task.id);
      if (index > -1) {
        appData.archive.splice(index, 1);
        // Silinen arşiv görevi çöp kutusuna taşınsın:
        task.deleted = true;
        appData.trash.push(task);
      }
      saveData(appData);
      renderArchive();
      renderTrash();
    });
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    archiveList.appendChild(li);
  });
}

// Çöp kutusu sayfası render fonksiyonu
function renderTrash() {
  const trashList = document.getElementById("trash-list");
  trashList.innerHTML = "";
  appData.trash.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "↩️";
    restoreBtn.title = "Geri al";
    restoreBtn.addEventListener("click", () => {
      const index = appData.trash.findIndex(t => t.id === task.id);
      if (index > -1) appData.trash.splice(index, 1);
      task.deleted = false;

      // appData.tasks içine ekle (tarih bilgisi yoksa "general" olarak ekle)
      let added = false;
      for (const key in appData.tasks) {
        if (!appData.tasks[key].some(t => t.id === task.id)) {
          appData.tasks[key].push(task);
          added = true;
          break;
        }
      }
      if (!added) {
        if (!appData.tasks["general"]) appData.tasks["general"] = [];
        appData.tasks["general"].push(task);
      }

      saveData(appData);
      renderTrash();
      renderTasksForCalendar(selectedDate);
    });
    actions.appendChild(restoreBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Sil";
    deleteBtn.addEventListener("click", () => {
      const index = appData.trash.findIndex(t => t.id === task.id);
      if (index > -1) appData.trash.splice(index, 1);
      saveData(appData);
      renderTrash();
    });
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    trashList.appendChild(li);
  });
}

// Tarihi string olarak formatla (yyyy-mm-dd)
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// LocalStorage'a kaydet
function saveData(data) {
  localStorage.setItem("todoAppData", JSON.stringify(data));
}

// LocalStorage'dan yükle
function loadData() {
  const str = localStorage.getItem("todoAppData");
  if (str) return JSON.parse(str);
  return { tasks: {}, archive: [], trash: [] };
}

// İki tarihi karşılaştır (saat, dakika, saniye önemli değil)
function isSameDate(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Seçili tarih yazılarını güncelle
function updateSelectedDateTexts() {
  const trDate = selectedDate.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (selectedDateHeader) selectedDateHeader.textContent = `${trDate} Görevleri`;
}



//------------------------------------------------------------------------------------------------//


//RENK TOPLARI

const customColors = [
  '#004aad',   
  '#219150',
  '#004aad'
];

const minDistance = 40; // toplar arasındaki minimum boşluk (px cinsinden)
const margin = 25; // kenarlarda boşluk bırakmak için


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('sidebar-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    // canvas boyutlarını sidebar piksel boyutuna eşitle
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class ColorBall {
  
    constructor(existingBalls) {
  const margin = 50;
  const minDistance = 20;

  this.radius = 30 + Math.random() * 40;  // 30-70 arası rastgele
  this.color = customColors[Math.floor(Math.random() * customColors.length)];

  let validPosition = false;
  while (!validPosition) {
    this.x = Math.random() * (canvas.width - 2 * margin) + margin;
    this.y = Math.random() * (canvas.height - 2 * margin) + margin;

    if (!existingBalls || existingBalls.every(ball => {
      const dx = ball.x - this.x;
      const dy = ball.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist > (ball.radius + this.radius + minDistance);
    })) {
      validPosition = true;
    }
  }

  this.vx = (Math.random() - 0.5) * 2.5;
  this.vy = (Math.random() - 0.5) * 2.5;
}



  draw() {
    const grad = ctx.createRadialGradient(this.x, this.y, this.radius * 0.3, this.x, this.y, this.radius);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if(this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.vx = -this.vx;
    if(this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.vy = -this.vy;
  }
}


  const balls = [];
  const BALL_COUNT = 10;
  for(let i=0; i<BALL_COUNT; i++) {
    balls.push(new ColorBall());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
      ball.update();
      ball.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
});



// Enter tuşu ile takvim görev ekleme
taskInputCalendar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskBtnCalendar.click();
  }
});
