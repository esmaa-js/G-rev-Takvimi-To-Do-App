// Notlar sayfası için DOM elementleri
const newCategoryInputNotes = document.getElementById("new-category-input");
const addCategoryBtnNotes = document.getElementById("add-category-btn");
const categorySelectNotes = document.getElementById("category-select");
const newTaskInputNotes = document.getElementById("new-task-input");
const addTaskBtnNotes = document.getElementById("add-task-btn");
const todoCategoriesDivNotes = document.getElementById("todo-categories");
const completedTasksListNotes = document.getElementById("completed-tasks-list");
const categoryListContainer = document.getElementById("category-list-container");

// appData içine kategori ve görev yapısı ekle
if (!appData.categories) appData.categories = [];
if (!appData.categoryTasks) appData.categoryTasks = {};
if (!appData.trash) appData.trash = []; // Çöp kutusu dizisi ekli

// Yeni kategori ekleme fonksiyonu
function addCategoryNotes(name) {
  if (!name) return;
  if (appData.categories.includes(name)) {
    alert("Bu kategori zaten var!");
    return;
  }
  appData.categories.push(name);
  appData.categoryTasks[name] = [];
  saveData(appData);
  renderCategoriesNotes();
  renderTasksForCategoriesNotes();
  renderCompletedTasksNotes();
  clearCategoryInputNotes();
}

// Kategorileri dropdown ve yapılacaklar kutularında göster
function renderCategoriesNotes() {
  // Dropdown doldur
  categorySelectNotes.innerHTML = "";
   // renderCategoriesNotes fonksiyonunda, categorySelectNotes.innerHTML = ""'den hemen sonra ekle:

const placeholderOption = document.createElement("option");
placeholderOption.value = "";
placeholderOption.disabled = true;
placeholderOption.selected = true;
placeholderOption.textContent = "Kategori seçiniz";
categorySelectNotes.appendChild(placeholderOption);




  appData.categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelectNotes.appendChild(option);
  });

  // Kategori listesi (sil, arşivle butonlu)
  categoryListContainer.innerHTML = "";
  appData.categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category-item";

    const span = document.createElement("span");
    span.textContent = cat;
    div.appendChild(span);

    // Sil butonu (kategori ve içindekileri çöpe taşır)
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Kategoriyi ve içindekileri sil (Çöp Kutusuna Taşı)";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`"${cat}" kategorisi ve içindeki tüm görevler çöpe taşınacak. Emin misiniz?`)) {
        // Kategoriyi sil
        appData.categories = appData.categories.filter(c => c !== cat);

        // Görevleri çöpe taşı
        const tasksToTrash = appData.categoryTasks[cat] || [];
        tasksToTrash.forEach(task => {
          task.deleted = true;
          task.completed = false;
          task.archived = false;
          appData.trash.push(task);
        });

        // Kategorinin görevlerini sil
        delete appData.categoryTasks[cat];
        saveData(appData);
        renderCategoriesNotes();
        renderTasksForCategoriesNotes();
        renderCompletedTasksNotes();
        renderTrash();
      }
    });
    div.appendChild(deleteBtn);

    // Arşive ekle butonu (kategori içindeki tamamlanmamış görevleri arşive taşır)
    const archiveBtn = document.createElement("button");
    archiveBtn.textContent = "📦";
    archiveBtn.title = "Kategorideki tamamlanmamış görevleri arşive taşı";
    archiveBtn.addEventListener("click", () => {
      if (confirm(`"${cat}" kategorisindeki tamamlanmamış görevler arşive taşınacak.`)) {
        const tasks = appData.categoryTasks[cat];
        tasks.forEach(task => {
          if (!task.completed && !task.archived && !task.deleted) {
            task.archived = true;
            appData.archive.push(task);
          }
        });
        // Kategoriden arşivlenen görevleri çıkar
        appData.categoryTasks[cat] = tasks.filter(t => !t.archived);
        saveData(appData);
        renderCategoriesNotes();
        renderTasksForCategoriesNotes();
        renderCompletedTasksNotes();
        renderArchive();
      }
    });
    div.appendChild(archiveBtn);

    categoryListContainer.appendChild(div);
  });
}

// Seçilen kategoriye görev ekle
function addTaskToCategoryNotes(category, text) {
  if (!category || !text) return;

  const newTask = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    archived: false,
    deleted: false
  };

  if (!appData.categoryTasks[category]) {
    appData.categoryTasks[category] = [];
  }
  appData.categoryTasks[category].push(newTask);
  saveData(appData);
  renderTasksForCategoriesNotes();
  renderCompletedTasksNotes();
  clearTaskInputNotes();
}

// Kategori bazlı görevleri listele
function renderTasksForCategoriesNotes() {
  todoCategoriesDivNotes.innerHTML = "";

  appData.categories.forEach(cat => {
    const ul = document.createElement("ul");
    ul.className = "task-list";

    const container = document.createElement("div");
    container.className = "todo-category";

    const title = document.createElement("h4");
    title.textContent = cat;
    container.appendChild(title);
    container.appendChild(ul);

    const tasks = appData.categoryTasks[cat] || [];
    tasks.forEach(task => {
      if (!task.archived && !task.deleted && !task.completed) {
        const li = document.createElement("li");
        li.className = "task-item";
        li.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔️";
        completeBtn.title = "Tamamlandı olarak işaretle";
        completeBtn.addEventListener("click", () => {
          task.completed = true;
          saveData(appData);
          renderTasksForCategoriesNotes();
          renderCompletedTasksNotes();
        });
        actions.appendChild(completeBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.title = "Görevi çöpe taşı";
        deleteBtn.addEventListener("click", () => {
          // Görevi çöpe taşı
          task.deleted = true;
          // Görevin bulunduğu kategoriden çıkar
          appData.categoryTasks[cat] = appData.categoryTasks[cat].filter(t => t.id !== task.id);
          appData.trash.push(task);  // Burada çöp kutusuna ekleme yapıldı
          saveData(appData);
          renderTasksForCategoriesNotes();
          renderCompletedTasksNotes();
          renderTrash();
        });
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        ul.appendChild(li);
      }
    });

    todoCategoriesDivNotes.appendChild(container);
  });
}

// Tamamlanan görevleri sağ sütunda göster
function renderCompletedTasksNotes() {
  completedTasksListNotes.innerHTML = "";
  appData.categories.forEach(cat => {
    const tasks = appData.categoryTasks[cat] || [];
    tasks.filter(t => t.completed && !t.deleted && !t.archived).forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item completed";
      li.textContent = `${task.text} (${cat})`;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "↩️";
      restoreBtn.title = "Görevi tamamlanmamış yap";
      restoreBtn.addEventListener("click", () => {
        task.completed = false;
        saveData(appData);
        renderTasksForCategoriesNotes();
        renderCompletedTasksNotes();
      });
      actions.appendChild(restoreBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.title = "Görevi çöpe taşı";
      deleteBtn.addEventListener("click", () => {
        task.deleted = true;
        // Görevin bulunduğu kategoriden çıkar
        appData.categoryTasks[cat] = appData.categoryTasks[cat].filter(t => t.id !== task.id);
        appData.trash.push(task);  // Burada çöp kutusuna ekleme yapıldı
        saveData(appData);
        renderCompletedTasksNotes();
        renderTrash();
      });
      actions.appendChild(deleteBtn);

      li.appendChild(actions);
      completedTasksListNotes.appendChild(li);
    });
  });
}

// Yardımcı fonksiyonlar
function clearCategoryInputNotes() {
  newCategoryInputNotes.value = "";
}

function clearTaskInputNotes() {
  newTaskInputNotes.value = "";
}

// Başlangıçta render işlemleri
renderCategoriesNotes();
renderTasksForCategoriesNotes();
renderCompletedTasksNotes();

// Event listener'lar
addCategoryBtnNotes.addEventListener("click", () => {
  const name = newCategoryInputNotes.value.trim();
  addCategoryNotes(name);
});

addTaskBtnNotes.addEventListener("click", () => {
  const category = categorySelectNotes.value;
  const text = newTaskInputNotes.value.trim();
  if (!category) {
    alert("Lütfen bir kategori seçin!");
    return;
  }
  if (!text) {
    alert("Görev boş olamaz!");
    return;
  }
  addTaskToCategoryNotes(category, text);
});


// Enter tuşu ile kategori ekleme
newCategoryInputNotes.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addCategoryBtnNotes.click();
  }
});


// Enter tuşu ile görev ekleme
newTaskInputNotes.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskBtnNotes.click();
  }
});
