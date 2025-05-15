<?php
require_once 'includes/config.php';
requireLogin();

$db = getDB();
$tickets = $db['tickets'];
$clientes = $db['clientes'];
$currentUser = getCurrentUser();

// Crear nuevo ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'crear') {
    $nuevoTicket = [
        'id' => 'T' . time(),
        'clienteId' => $_POST['clienteId'],
        'estado' => 'abierto',
        'departamento' => $_POST['departamento'],
        'problema' => $_POST['problema'],
        'notas' => [],
        'fechaCreacion' => date('c'),
        'fechaActualizacion' => date('c'),
        'asignadoA' => $currentUser['id']
    ];
    
    $db['tickets'][] = $nuevoTicket;
    saveDB($db);
    header('Location: tickets.php');
    exit;
}

include 'includes/header.php';
?>

<div class="header-actions">
    <h1>Gestión de Tickets</h1>
    <button class="btn btn-primary" onclick="document.getElementById('modalCrear').style.display='block'">
        Nuevo Ticket
    </button>
</div>

<div class="card">
    <table class="table">
        <thead>
            <tr>
                <th>ID Ticket</th>
                <th>Cliente</th>
                <th>Problema</th>
                <th>Estado</th>
                <th>Departamento</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($tickets as $ticket): 
                $cliente = array_filter($clientes, fn($c) => $c['id'] === $ticket['clienteId']);
                $cliente = reset($cliente);
            ?>
            <tr>
                <td><?php echo htmlspecialchars($ticket['id']); ?></td>
                <td><?php echo htmlspecialchars($cliente['nombre']); ?></td>
                <td><?php echo htmlspecialchars(substr($ticket['problema'], 0, 50)) . '...'; ?></td>
                <td>
                    <span class="badge badge-<?php 
                        echo $ticket['estado'] === 'abierto' ? 'danger' : 
                             ($ticket['estado'] === 'en-proceso' ? 'warning' : 
                             ($ticket['estado'] === 'resuelto' ? 'success' : 'secondary')); 
                    ?>">
                        <?php echo htmlspecialchars($ticket['estado']); ?>
                    </span>
                </td>
                <td><?php echo htmlspecialchars($ticket['departamento']); ?></td>
                <td><?php echo date('d/m/Y H:i', strtotime($ticket['fechaCreacion'])); ?></td>
                <td>
                    <a href="detalle_ticket.php?id=<?php echo $ticket['id']; ?>" class="btn btn-small">Ver Detalles</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<!-- Modal Crear Ticket -->
<div id="modalCrear" class="modal">
    <div class="modal-content">
        <span class="close" onclick="document.getElementById('modalCrear').style.display='none'">&times;</span>
        <h2>Crear Nuevo Ticket</h2>
        <form method="post">
            <input type="hidden" name="action" value="crear">
            
            <div class="form-group">
                <label>Cliente</label>
                <select name="clienteId" class="form-control" required>
                    <option value="">Seleccionar cliente...</option>
                    <?php foreach ($clientes as $cliente): ?>
                    <option value="<?php echo $cliente['id']; ?>">
                        <?php echo htmlspecialchars($cliente['nombre'] . ' - ' . $cliente['numeroCliente']); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
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
            
            <div class="form-group">
                <label>Problema</label>
                <textarea name="problema" class="form-control" rows="4" required></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary">Crear Ticket</button>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>