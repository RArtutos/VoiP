<?php
require_once 'includes/config.php';
requireLogin();

$db = getDB();
$clientes = $db['clientes'];

// Crear nuevo cliente
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'crear') {
    $nuevoCliente = [
        'id' => uniqid(),
        'nombre' => $_POST['nombre'],
        'telefono' => $_POST['telefono'],
        'email' => $_POST['email'],
        'direccion' => $_POST['direccion'],
        'numeroCliente' => 'C' . time(),
        'fechaRegistro' => date('Y-m-d'),
        'planActual' => $_POST['planActual'],
        'estado' => 'activo'
    ];
    
    $db['clientes'][] = $nuevoCliente;
    saveDB($db);
    header('Location: clientes.php');
    exit;
}

include 'includes/header.php';
?>

<div class="header-actions">
    <h1>Directorio de Clientes</h1>
    <button class="btn btn-primary" onclick="document.getElementById('modalCrear').style.display='block'">
        Nuevo Cliente
    </button>
</div>

<div class="card">
    <table class="table">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Número Cliente</th>
                <th>Teléfono</th>
                <th>Plan Actual</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($clientes as $cliente): ?>
            <tr>
                <td>
                    <?php echo htmlspecialchars($cliente['nombre']); ?>
                    <div class="text-small"><?php echo htmlspecialchars($cliente['email']); ?></div>
                </td>
                <td><?php echo htmlspecialchars($cliente['numeroCliente']); ?></td>
                <td><?php echo htmlspecialchars($cliente['telefono']); ?></td>
                <td><?php echo htmlspecialchars($cliente['planActual']); ?></td>
                <td>
                    <span class="badge badge-<?php echo $cliente['estado'] === 'activo' ? 'success' : 'danger'; ?>">
                        <?php echo htmlspecialchars($cliente['estado']); ?>
                    </span>
                </td>
                <td>
                    <a href="detalle_cliente.php?id=<?php echo $cliente['id']; ?>" class="btn btn-small">Ver Detalles</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<!-- Modal Crear Cliente -->
<div id="modalCrear" class="modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('modalCrear').style.display='none'">&times;</span>
        <h2>Crear Nuevo Cliente</h2>
        <form method="post">
            <input type="hidden" name="action" value="crear">
            
            <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Teléfono</label>
                <input type="tel" name="telefono" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Dirección</label>
                <input type="text" name="direccion" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Plan</label>
                <select name="planActual" class="form-control" required>
                    <option value="Fibra 100MB">Fibra 100MB</option>
                    <option value="Fibra 300MB">Fibra 300MB</option>
                    <option value="Fibra 500MB">Fibra 500MB</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Crear Cliente</button>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>