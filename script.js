// نظام إدارة أوتاكونوفا
const App = {
    queue: [],
    history: JSON.parse(localStorage.getItem('on_history') || '[]'),

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderHistory();
    },

    cacheDOM() {
        this.fileNameInput = document.getElementById('fileName');
        this.addBtn = document.getElementById('addBtn');
        this.startBtn = document.getElementById('startBtn');
        this.queueList = document.getElementById('queueList');
        this.historyList = document.getElementById('historyList');
        this.historyCount = document.getElementById('historyCount');
    },

    bindEvents() {
        this.addBtn.onclick = () => this.addTask();
        this.startBtn.onclick = () => this.processQueue();
    },

    addTask() {
        const name = this.fileNameInput.value.trim();
        if (!name) return alert("يرجى إدخال اسم!");

        const task = { id: Date.now(), name, progress: 0, status: 'waiting' };
        this.queue.push(task);
        this.renderQueue();
        this.fileNameInput.value = '';
    },

    renderQueue() {
        this.queueList.innerHTML = this.queue.map(task => `
            <div class="task-card" id="task-${task.id}">
                <div style="display:flex; justify-content:space-between">
                    <strong>${task.name}</strong>
                    <span>${Math.round(task.progress)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
                <small style="color:var(--text-dim)">الحالة: ${task.status}</small>
            </div>
        `).join('');
    },

    async processQueue() {
        if (this.queue.length === 0) return;

        for (let task of this.queue) {
            if (task.status === 'done') continue;
            
            task.status = 'جارٍ التحميل...';
            this.renderQueue();

            await this.simulateDownload(task);

            task.status = 'done';
            this.history.push({ name: task.name, date: new Date().toLocaleTimeString() });
            this.saveData();
        }
        
        this.queue = [];
        this.renderQueue();
        this.renderHistory();
    },

    simulateDownload(task) {
        return new Promise(resolve => {
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 15;
                task.progress = Math.min(100, p);
                this.renderQueue();
                if (p >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 400);
        });
    },

    saveData() {
        localStorage.setItem('on_history', JSON.stringify(this.history));
    },

    renderHistory() {
        this.historyCount.innerText = this.history.length;
        this.historyList.innerHTML = this.history.slice().reverse().map(item => `
            <div style="padding:10px; border-bottom: 1px solid #1a1a21">
                <div style="font-size:14px">${item.name}</div>
                <small style="color:var(--text-dim)">${item.date}</small>
            </div>
        `).join('');
    }
};

// تشغيل النظام
App.init();
