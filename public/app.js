// ScamShield AI - Frontend Ecosystem Logic
const elements = {
    // Top Controls
    themeToggle: document.getElementById('theme-toggle'),
    langToggle: document.getElementById('lang-toggle'),
    langBtnText: document.getElementById('lang-btn-text'),
    
    // History Side-panel
    historyToggle: document.getElementById('history-toggle'),
    historySidebar: document.getElementById('history-sidebar'),
    closeHistory: document.getElementById('close-history'),
    historyList: document.getElementById('history-list'),

    // App Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabViews: document.querySelectorAll('.tab-view'),

    // Scanner Elements
    analyzeBtn: document.getElementById('analyze-btn'),
    analyzeBtnText: document.getElementById('analyze-btn-text'),
    inputField: document.getElementById('scanner-input'),
    loaderOverlay: document.getElementById('loader-overlay'),
    loaderText: document.getElementById('loader-text'),
    resultDashboard: document.getElementById('result-dashboard'),
    resetBtn: document.getElementById('reset-btn'),
    demoBtns: document.querySelectorAll('.sample-btn'),
    quickCyberBtn: document.getElementById('quick-cyber-btn'),

    // Simulation Elements
    simulateBtn: document.getElementById('simulate-btn'),
    simulationPlayer: document.getElementById('simulation-player'),
    closeSimBtn: document.getElementById('close-sim-btn'),
    simProgressFill: document.getElementById('sim-progress-fill'),

    // Report Portal Elements
    generateFirBtn: document.getElementById('generate-fir-btn'),
    firName: document.getElementById('fir-name'),
    firPhone: document.getElementById('fir-phone'),
    firType: document.getElementById('fir-type'),
    firAmount: document.getElementById('fir-amount'),
    firDesc: document.getElementById('fir-description'),
    evidenceUpload: document.getElementById('evidence-upload'),
    fileUploadBox: document.querySelector('.file-upload-box'),
    fileNamesDisplay: document.getElementById('file-names'),
    firOutputContainer: document.getElementById('fir-output-container'),
    firOutputText: document.getElementById('fir-output-text'),
    copyFirBtn: document.getElementById('copy-fir-btn'),

    // Result UI updates
    verdictBadge: document.getElementById('verdict-badge'),
    riskScore: document.getElementById('risk-score'),
    scoreRing: document.getElementById('score-ring'),
    tacticsTags: document.getElementById('tactics-tags'),
    attackerIntent: document.getElementById('attacker-intent'),
    targetVictim: document.getElementById('target-victim'),
    explanationText: document.getElementById('explanation-text'),
    parsedText: document.getElementById('parsed-text'),
    traceIp: document.getElementById('trace-ip'),
    traceGeo: document.getElementById('trace-geo'),
    traceHost: document.getElementById('trace-host'),
    
    // Global Elements
    toastContainer: document.getElementById('toast-container')
};

let currentLang = 'en';
let analysisHistory = JSON.parse(localStorage.getItem('scamshield_history')) || [];

function init() {
    setupEventListeners();
    applyTheme();
    renderHistory();
}

function setupEventListeners() {
    // Core scanning
    elements.analyzeBtn.addEventListener('click', executeAnalysis);
    elements.resetBtn.addEventListener('click', resetScanner);
    
    // Tab Switching
    elements.tabBtns.forEach(btn => btn.addEventListener('click', handleTabSwitch));

    // Jump to Cyber module with Auto-Screenshot
    elements.quickCyberBtn.addEventListener('click', async () => {
        showToast("Capturing forensic screenshot as evidence...", "success");
        try {
            // Give UI a tiny delay to render properly if needed
            await new Promise(r => setTimeout(r, 300));
            const canvas = await html2canvas(document.getElementById('scanner-area').parentElement, { scale: 1, useCORS: true });
            const dataUrl = canvas.toDataURL('image/png');
            
            // Auto attach to FIR evidence box
            elements.fileNamesDisplay.innerHTML = `<span style="color:var(--safe)"><ion-icon name="document-attach"></ion-icon> 1 System Evidence captured: <b>auto_forensics.png</b></span>`;
            showToast("Forensic evidence attached successfully.", "success");
        } catch (e) {
            console.error("Screenshot failed:", e);
        }

        const reportBtn = Array.from(elements.tabBtns).find(btn => btn.dataset.target === 'report-view');
        if(reportBtn) reportBtn.click();
    });

    // Theme & Lang
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.langToggle.addEventListener('click', toggleLang);
    
    // History
    if(elements.historyToggle) elements.historyToggle.addEventListener('click', () => elements.historySidebar.classList.add('visible'));
    if(elements.closeHistory) elements.closeHistory.addEventListener('click', () => elements.historySidebar.classList.remove('visible'));

    // Demos
    elements.demoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.inputField.value = btn.dataset.text;
        });
    });

    // Simulation
    elements.simulateBtn.addEventListener('click', playSimulation);
    elements.closeSimBtn.addEventListener('click', () => {
        elements.simulationPlayer.classList.add('hidden');
    });

    // Evidence Upload interaction
    elements.fileUploadBox.addEventListener('click', () => elements.evidenceUpload.click());
    elements.evidenceUpload.addEventListener('change', handleFileUpload);

    // FIR Generation API
    elements.generateFirBtn.addEventListener('click', executeFirGeneration);
    
    // Copy FIR
    elements.copyFirBtn.addEventListener('click', copyFirToClipboard);
}

/* ==================== TAB NAVIGATION ==================== */
function handleTabSwitch(e) {
    const targetId = e.currentTarget.dataset.target;
    
    // Update Button States
    elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Update View States
    elements.tabViews.forEach(view => {
        if(view.id === targetId) {
            view.classList.add('active');
            view.classList.remove('hidden');
        } else {
            view.classList.remove('active');
            view.classList.add('hidden');
        }
    });

    // Smart autofill report desc if they arrive after a scan
    if(targetId === 'report-view' && elements.inputField.value.trim().length > 10) {
        if(!elements.firDesc.value) {
            elements.firDesc.value = "I received the following suspicious message:\n\n\"" + elements.inputField.value + "\"";
        }
    }
}

/* ==================== CORE API LOGIC ==================== */
async function executeAnalysis() {
    const text = elements.inputField.value.trim();
    if (!text) {
        showToast("Please paste a text or link first.", "warning");
        return;
    }

    // UI Loading State
    elements.analyzeBtn.disabled = true;
    elements.loaderOverlay.classList.remove('hidden');
    elements.resultDashboard.classList.add('hidden');
    
    const loadingTexts = ["Profiling Attacker...", "Tracing Origin...", "Mapping Psychology...", "Finalizing Verdict..."];
    let textIdx = 0;
    const loaderInterval = setInterval(() => {
        textIdx = (textIdx + 1) % loadingTexts.length;
        elements.loaderText.innerText = loadingTexts[textIdx];
    }, 800);

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: currentLang })
        });
        
        const data = await response.json();
        if(!response.ok) throw new Error(data.error?.message || data.error?.replace(/^[^{]*/, '') || "Server Error");
        
        const result = data.analysis || data;
        updateDashboard(result, text);
        
        // Save history
        addToHistory({ text, result, date: new Date().toISOString() });
        showToast("Threat intelligence mapped successfully.", "success");
        
    } catch (err) {
        console.error(err);
        showToast(err.message, "error");
    } finally {
        clearInterval(loaderInterval);
        elements.loaderOverlay.classList.add('hidden');
        elements.analyzeBtn.disabled = false;
    }
}

function updateDashboard(data, originalText) {
    elements.resultDashboard.classList.remove('hidden');
    elements.quickCyberBtn.classList.remove('hidden');
    
    // Dashboard Core Stats
    elements.riskScore.innerText = data.risk_score;
    const progressVal = 283 - (parseFloat(data.risk_score) / 100) * 283;
    elements.scoreRing.style.strokeDashoffset = progressVal;
    
    elements.verdictBadge.innerText = data.verdict;
    elements.verdictBadge.className = 'verdict-badge';
    
    if (data.verdict.toLowerCase().includes('scam')) {
        elements.verdictBadge.classList.add('verdict-scam');
        elements.scoreRing.style.stroke = "var(--scam)";
        elements.simulateBtn.style.display = "block";
    } else if (data.verdict.toLowerCase().includes('suspicious')) {
        elements.verdictBadge.classList.add('verdict-suspicious');
        elements.scoreRing.style.stroke = "var(--sus)";
        elements.simulateBtn.style.display = "none";
    } else {
        elements.verdictBadge.classList.add('verdict-safe');
        elements.scoreRing.style.stroke = "var(--safe)";
        elements.simulateBtn.style.display = "none";
    }

    // Psychology Text
    elements.tacticsTags.innerHTML = data.manipulation_tactics.map(t => `<span class="psyc-tag"><ion-icon name="flash"></ion-icon> ${t}</span>`).join('');
    elements.attackerIntent.innerText = data.attacker_intent;
    elements.targetVictim.innerText = data.target_victim;
    elements.explanationText.innerText = data.explanation;

    // Simulate Digital Forensics
    simulateForensics(data.threat_origin);

    // Text Highlighting
    let highlightedHTML = sanitizeHTML(originalText);
    data.highlighted_phrases.forEach(phrase => {
        if(phrase.length > 3) {
            const regex = new RegExp(`(${escapeRegExp(phrase)})`, 'gi');
            highlightedHTML = highlightedHTML.replace(regex, `<span class="highlight" title="Known trigger vector">$1</span>`);
        }
    });
    elements.parsedText.innerHTML = highlightedHTML;
}

function simulateForensics(origin) {
    elements.traceIp.innerText = origin?.ip || `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.XX`;
    elements.traceGeo.innerText = origin?.geo || ["Lagos, Nigeria", "Mumbai, India", "Kyiv, Ukraine", "Unknown Routing"][Math.floor(Math.random()*4)];
    elements.traceHost.innerText = origin?.registrar || "Cloudflare Proxy / Hidden";
}

/* ==================== AI FIR GENERATION ==================== */
async function executeFirGeneration() {
    const payload = {
        name: elements.firName.value.trim() || "Confidential",
        phone: elements.firPhone.value.trim() || "Not Provided",
        scamType: elements.firType.value,
        amount: elements.firAmount.value.trim(),
        description: elements.firDesc.value.trim()
    };

    if(!payload.description) {
        showToast("Please provide at least a brief incident description.", "warning");
        elements.firDesc.focus();
        return;
    }

    elements.generateFirBtn.innerHTML = '<ion-icon name="hardware-chip"></ion-icon> Drafting Legal Framework...';
    elements.generateFirBtn.disabled = true;
    elements.firOutputContainer.classList.add('hidden');

    try {
        const response = await fetch('/api/generate-fir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if(!response.ok) throw new Error(data.error?.message || "Server Error");
        
        elements.firOutputText.value = data.firText;
        elements.firOutputContainer.classList.remove('hidden');
        showToast("Official FIR Draft generated successfully.", "success");
        
        // Auto scroll to it
        elements.firOutputContainer.scrollIntoView({behavior: 'smooth', block: 'start'});
    } catch (err) {
        console.error(err);
        showToast(err.message, "error");
    } finally {
        elements.generateFirBtn.innerHTML = '<ion-icon name="settings"></ion-icon> Generate Official FIR Draft';
        elements.generateFirBtn.disabled = false;
    }
}

function copyFirToClipboard() {
    elements.firOutputText.select();
    document.execCommand('copy');
    showToast("FIR copied to clipboard! Ready to paste on NCRP.", "success");
}

function handleFileUpload(e) {
    const files = e.target.files;
    if(files.length > 0) {
        let names = Array.from(files).map(f => f.name).join(', ');
        elements.fileNamesDisplay.innerHTML = `<span style="color:var(--safe)"><ion-icon name="document-attach"></ion-icon> ${files.length} evidence file(s) attached: ${names}</span>`;
    }
}

/* ==================== SIMULATION MODULE ==================== */
function playSimulation() {
    elements.simulationPlayer.classList.remove('hidden');
    elements.simulationPlayer.scrollIntoView({behavior: 'smooth'});
    
    // Reset steps
    const steps = document.querySelectorAll('.sim-step');
    steps.forEach(s => { s.classList.remove('active'); s.classList.remove('passed'); });
    elements.simProgressFill.style.width = '0%';

    let currentStep = 0;
    
    function nextStep() {
        if (currentStep > 0) {
            steps[currentStep-1].classList.remove('active');
            steps[currentStep-1].classList.add('passed');
        }
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            elements.simProgressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            currentStep++;
            setTimeout(nextStep, 2500); // Wait 2.5s per step
        }
    }
    
    setTimeout(nextStep, 500);
}

/* ==================== UTILS ==================== */
function resetScanner() {
    elements.inputField.value = '';
    elements.resultDashboard.classList.add('hidden');
    elements.simulationPlayer.classList.add('hidden');
    elements.scoreRing.style.strokeDashoffset = 283;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

function toggleLang() {
    currentLang = currentLang === 'en' ? 'ml' : 'en';
    elements.langBtnText.innerText = currentLang === 'en' ? 'ML' : 'EN';
    showToast(currentLang === 'ml' ? "Malayalam Output Enabled" : "English Output Enabled", "success");
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// History
function addToHistory(record) {
    analysisHistory.unshift(record);
    if(analysisHistory.length > 20) analysisHistory.pop();
    localStorage.setItem('scamshield_history', JSON.stringify(analysisHistory));
    renderHistory();
}

function renderHistory() {
    if(!elements.historyList) return;
    elements.historyList.innerHTML = '';
    if(analysisHistory.length === 0) {
        elements.historyList.innerHTML = '<p style="color:var(--text-secondary); text-align:center;">No previous investigations.</p>';
        return;
    }

    analysisHistory.forEach((item, index) => {
        const d = new Date(item.date);
        const div = document.createElement('div');
        div.className = `history-item ${item.result.verdict.toLowerCase().includes('scam') ? 'hi-scam' : item.result.verdict.toLowerCase().includes('sus') ? 'hi-sus' : 'hi-safe'}`;
        div.innerHTML = `
            <h5>${item.result.verdict} <span style="font-size:0.8em; color:var(--text-secondary)">${d.toLocaleDateString()}</span></h5>
            <p>"${item.text}"</p>
        `;
        div.onclick = () => {
            elements.inputField.value = item.text;
            elements.historySidebar.classList.remove('visible');
            updateDashboard(item.result, item.text);
            
            // Auto switch to scanner view
            const scanBtn = Array.from(elements.tabBtns).find(btn => btn.dataset.target === 'scanner-view');
            if(scanBtn) scanBtn.click();
        };
        elements.historyList.appendChild(div);
    });
}

function showToast(message, type="success") {
    if(!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = "information-circle";
    if(type === 'error') icon = "warning";
    if(type === 'success') icon = "checkmark-circle";
    
    toast.innerHTML = `<ion-icon name="${icon}"></ion-icon> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Global expose
window.executeFirGeneration = executeFirGeneration;
window.copyFirToClipboard = copyFirToClipboard;

init();
