// Google Apps Script para revalidación automática
// Copia este código en Google Apps Script de tu Google Sheet

function onEdit(e) {
  // Solo ejecutar si se edita la hoja de productos
  if (e.source.getActiveSheet().getName() !== "Productos") {
    return;
  }
  
  // Llamar a revalidación con un pequeño delay para evitar múltiples llamadas
  Utilities.sleep(1000);
  revalidateProducts();
}

function onOpen() {
  // Crear menú personalizado para revalidación manual
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Sergalgos')
    .addItem('Revalidar Productos', 'revalidateProducts')
    .addToUi();
}

function revalidateProducts() {
  const REVALIDATE_URL = 'https://sergalgos.vercel.app/api/revalidate';
  const SECRET = PropertiesService.getScriptProperties().getProperty('REVALIDATE_SECRET');
  
  if (!SECRET) {
    console.error('ERROR: REVALIDATE_SECRET no está configurado en las propiedades del script');
    SpreadsheetApp.getUi().alert('Error: Falta configurar REVALIDATE_SECRET en las propiedades del script');
    return;
  }
  
  const payload = {
    secret: SECRET,
    tags: ['products']
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    console.log('🔄 Enviando revalidación para productos...');
    const response = UrlFetchApp.fetch(REVALIDATE_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    console.log('✅ Revalidación exitosa:', responseData);
    
    // Mostrar notificación en la hoja (opcional)
    SpreadsheetApp.getActiveSpreadsheet().toast('Productos revalidados exitosamente!', 'Sergalgos');
    
  } catch (error) {
    console.error('❌ Error en revalidación:', error);
    SpreadsheetApp.getUi().alert('Error al revalidar: ' + error.message);
  }
}

// Función para configurar el secret (ejecutar una vez)
function setupSecret() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Configurar Secret',
    'Ingresa el REVALIDATE_SECRET:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() == ui.Button.OK) {
    const secret = result.getResponseText();
    PropertiesService.getScriptProperties().setProperty('REVALIDATE_SECRET', secret);
    ui.alert('Secret configurado exitosamente!');
  }
}
