function validarEntrada(id, min, max) {
    const el = document.getElementById(id);
    const val = parseInt(el.value);
    el.style.borderColor = (isNaN(val) || val < min || val > max) ? "#ff5252" : "#00ff88";
}

function actualizarInfoRed(tipo) {
    const octeto = document.getElementById('oct' + tipo).value;
    const infoBox = document.getElementById('info' + tipo);
    if (octeto >= 1 && octeto <= 254) {
        infoBox.innerText = `Gateway: 192.168.${octeto}.1 | Host: .2 a .254`;
        infoBox.style.color = "#00ff88";
    } else {
        infoBox.innerText = "Rango: -";
        infoBox.style.color = "#ff5252";
    }
}

function generarPass() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@";
    let pass = "";
    for (let i = 0; i < 10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('passInput').value = pass;
}

function generarConfigDual() {
    const brand = document.getElementById('brandSelect').value;
    const trunk = document.getElementById('trunkPort').value || "1";
    const pass = document.getElementById('passInput').value || "admin123";
    
    const vC = document.getElementById('vlanCctv').value;
    const oC = document.getElementById('octCctv').value;
    const pC = document.getElementById('portsCctv').value;

    const vO = document.getElementById('vlanOff').value;
    const oO = document.getElementById('octOff').value;
    const pO = document.getElementById('portsOff').value;

    let s = `# HACKTECH CONFIG\n# SEGURIDAD: Password=${pass}\n\n`;

    if (brand === 'mikrotik') {
        s += `/user set admin password="${pass}"\n`;
        if(vC) s += `/interface vlan add name=VLAN_${vC}_CCTV vlan-id=${vC} interface=bridge\n/ip address add address=192.168.${oC}.1/24 interface=VLAN_${vC}_CCTV\n`;
        if(vO) s += `/interface vlan add name=VLAN_${vO}_OFFICE vlan-id=${vO} interface=bridge\n/ip address add address=192.168.${oO}.1/24 interface=VLAN_${vO}_OFFICE\n`;
    } else {
        s += `username admin password ${pass}\n`;
        if(vC) s += `vlan ${vC}\n name CCTV_NET\nexit\ninterface vlan ${vC}\n ip address 192.168.${oC}.1 255.255.255.0\nexit\n`;
        if(vO) s += `vlan ${vO}\n name OFFICE_NET\nexit\ninterface vlan ${vO}\n ip address 192.168.${oO}.1 255.255.255.0\nexit\n`;
        s += `interface fa0/${trunk}\n switchport mode trunk\n switchport trunk allowed vlan ${vC},${vO}\nexit\n`;
    }

    document.getElementById('result').style.display = "block";
    document.getElementById('cliScript').innerText = s;
}

function copiarAlPortapapeles() {
    const t = document.getElementById('cliScript').innerText;
    navigator.clipboard.writeText(t).then(() => alert("¡Script copiado para Termux!"));
}

function generarReporte() {
    const brand = document.getElementById('brandSelect').options[document.getElementById('brandSelect').selectedIndex].text;
    const pass = document.getElementById('passInput').value || "admin123";
    const vC = document.getElementById('vlanCctv').value || "N/A";
    const oC = document.getElementById('octCctv').value || "X";
    const vO = document.getElementById('vlanOff').value || "N/A";
    const oO = document.getElementById('octOff').value || "X";
    
    const qrText = `HACKTECH-NET\nPASS:${pass}\nCCTV:V${vC}-IP.${oC}.1\nOFF:V${vO}-IP.${oO}.1`;

    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>Reporte Técnico QR</title>
            <style>
                body { font-family: sans-serif; padding: 30px; }
                .header { display: flex; justify-content: space-between; border-bottom: 4px solid #00ff88; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; }
                .qr-box { text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div><h1>HACKTECH REPORT</h1><p>Arquitectura: ${brand}</p></div>
                <div id="qrcode"></div>
            </div>
            <table>
                <tr><th>Red</th><th>VLAN</th><th>Gateway</th></tr>
                <tr><td>CCTV</td><td>${vC}</td><td>192.168.${oC}.1</td></tr>
                <tr><td>OFICINA</td><td>${vO}</td><td>192.168.${oO}.1</td></tr>
            </table>
            <p><b>Password Admin:</b> ${pass}</p>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            <script>
                new QRCode(document.getElementById("qrcode"), { text: "${qrText.replace(/\n/g, '\\n')}", width: 120, height: 120 });
            </script>
        </body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 1000);
}
