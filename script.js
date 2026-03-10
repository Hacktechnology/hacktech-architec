function validarEntrada(id, min, max) {
    const el = document.getElementById(id);
    const val = parseInt(el.value);
    el.style.borderColor = (val < min || val > max) ? "#ff5252" : "#00ff88";
}

function actualizarInfoRed(tipo) {
    const oct = document.getElementById('oct' + tipo).value;
    const info = document.getElementById('info' + tipo);
    info.innerText = (oct >= 1 && oct <= 254) ? `Gateway: 192.168.${oct}.1 | Host: .2 a .254` : "Rango: -";
}

function generarPass() {
    const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
    let p = "";
    for (let i = 0; i < 10; i++) p += c.charAt(Math.floor(Math.random() * c.length));
    document.getElementById('passInput').value = p;
}

function toggleAyuda() {
    const div = document.getElementById('ayudaContent');
    div.style.display = (div.style.display === "none") ? "block" : "none";
}

function generarConfigDual() {
    const brand = document.getElementById('brandSelect').value;
    const pass = document.getElementById('passInput').value || "admin123";
    const vC = document.getElementById('vlanCctv').value;
    const oC = document.getElementById('octCctv').value;
    const vO = document.getElementById('vlanOff').value;
    const oO = document.getElementById('octOff').value;

    let s = `# HACKTECH CONFIG\n# PASS: ${pass}\n\n`;
    if (brand === 'mikrotik') {
        if(vC) s += `/interface vlan add name=VLAN_${vC}_CCTV vlan-id=${vC} interface=bridge\n/ip address add address=192.168.${oC}.1/24 interface=VLAN_${vC}_CCTV\n`;
        if(vO) s += `/interface vlan add name=VLAN_${vO}_DATA vlan-id=${vO} interface=bridge\n/ip address add address=192.168.${oO}.1/24 interface=VLAN_${vO}_DATA\n`;
    } else {
        if(vC) s += `vlan ${vC}\n name CCTV\nexit\ninterface vlan ${vC}\n ip address 192.168.${oC}.1 255.255.255.0\nexit\n`;
        if(vO) s += `vlan ${vO}\n name DATA\nexit\ninterface vlan ${vO}\n ip address 192.168.${oO}.1 255.255.255.0\nexit\n`;
    }

    document.getElementById('result').style.display = "block";
    document.getElementById('cliScript').innerText = s;
}

function copiarAlPortapapeles() {
    const t = document.getElementById('cliScript').innerText;
    navigator.clipboard.writeText(t).then(() => alert("Copiado para Termux"));
}

function generarReporte() {
    const pass = document.getElementById('passInput').value || "N/A";
    const qrText = `HT-NET\nPASS:${pass}\nCCTV.V20\nDATA.V30`;
    const win = window.open('', '_blank');
    win.document.write(`
        <html><body style="font-family:sans-serif; padding:40px;">
        <h1>REPORTE TÉCNICO HACKTECH</h1>
        <hr><div id="qrcode"></div>
        <p><b>Contraseña Administrativa:</b> ${pass}</p>
        <p>Configure las VLANs según este reporte.</p>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <script>new QRCode(document.getElementById("qrcode"), "${qrText}");</script>
        <script>setTimeout(() => window.print(), 1000);</script>
        </body></html>
    `);
    win.document.close();
}
