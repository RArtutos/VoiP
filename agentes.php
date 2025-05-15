<?php
require_once 'includes/config.php';
requireLogin();

$currentUser = getCurrentUser();
if ($currentUser['rol'] !== 'admin') {
    header('Location: dashboard.php');
    exit;
}

$db = getDB();
$usuarios = array_filter($db['usuarios'], fn($u) => $u['rol'] === 'agente');

// Crear nuevo agente
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'crear') {
    $nuevoAgente = [
        'id' => uniqid(),
        'nombreUsuario' => $_POST['nombreUsuario'],
        'nombre' => $_POST['nombre'],
        'password' => $_POST['password'],
        'rol' => 'agente',
        'departamento' => $_POST['departamento']
    ];
    
    $db['usuarios'][] = $nuevoAgente;
    saveDB($db);
    header('Location: agentes.php');
    exit;
}

include 'includes/header.php';
?>

<div class="header-actions">
    <h1>Gestión de Agentes</h1>
    <button class="btn btn-primary" onclick="document.getElementById('modalCrear').style.display='block'">
        Nuevo Agente
    </button>
</div>

<div class="card">
    <table class="table">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Departamento</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($usuarios as $usuario): ?>
            <tr>
                <td><?php echo htmlspecialchars($usuario['nombre']); ?></td>
                <td><?php echo htmlspecialchars($usuario['nombreUsuario']); ?></td>
                <td>
                    <span class="badge badge-info">
                        <?php echo htmlspecialchars($usuario['departamento']); ?>
                    </span>
                </td>
                <td>
                    <button class="btn btn-small" onclick="editarAgente('<?php echo $usuario['id']; ?>')">
                        Editar
                    </button>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<!-- Modal Crear Agente -->
<div id="modalCrear" class="modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('modalCrear').style.display='none'">&times;</span>
        <h2>Crear Nuevo Agente</h2>
        <form method="post">
            <input type="hidden" name="action" value="crear">
            
            <div class="form-group">
                <label>Nombre de Usuario</label>
                <input type="text" name="nombreUsuario" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label>Departamento</label>
                <select name="departamento" class="form-control" required>
                    <option value="tecnico">Soporte Técnico</option>
                    <option value="ventas">Ventas</option>
                    <option value="informacion">Información</option>
                    <option value="general">General</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Crear Agente</button>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>