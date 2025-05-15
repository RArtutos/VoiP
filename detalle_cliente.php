<?php
require_once 'includes/config.php';
requireLogin();

$db = getDB();
$id = $_GET['id'] ?? '';

$cliente = array_filter($db['clientes'], fn($c) => $c['id'] === $id);
$cliente = reset($cliente);

if (!$cliente) {
    header('Location: clientes.php');
    exit;
}

$tickets = array_filter($db['tickets'], fn($t) => $t['clienteId'] === $id);

include 'includes/header.php';
?>

<div class="header-actions">
    <a href="clientes.php" class="btn btn-link">&larr; Volver</a>
    <h1>Detalle del Cliente</h1>
</div>

<div class="grid">
    <div class="card">
        <h2>Información del Cliente</h2>
        <div class="info-grid">
            <div class="info-item">
                <label>Nombre:</label>
                <span><?php echo htmlspecialchars($cliente['nombre']); ?></span>
            </div>
            <div class="info-item">
                <label>Número de Cliente:</label>
                <span><?php echo htmlspecialchars($cliente['numeroCliente']); ?></span>
            </div>
            <div class="info-item">
                <label>Teléfono:</label>
                <span><?php echo htmlspecialchars($cliente['telefono']); ?></span>
            </div>
            <div class="info-item">
                <label>Email:</label>
                <span><?php echo htmlspecialchars($cliente['email']); ?></span>
            </div>
            <div class="info-item">
                <label>Dirección:</label>
                <span><?php echo htmlspecialchars($cliente['direccion']); ?></span>
            </div>
            <div class="info-item">
                <label>Plan Actual:</label>
                <span><?php echo htmlspecialchars($cliente['planActual']); ?></span>
            </div>
            <div class="info-item">
                <label>Estado:</label>
                <span class="badge badge-<?php echo $cliente['estado'] === 'activo' ? 'success' : 'danger'; ?>">
                    <?php echo htmlspecialchars($cliente['estado']); ?>
                </span>
            </div>
            <div class="info-item">
                <label>Fecha de Registro:</label>
                <span><?php echo date('d/m/Y', strtotime($cliente['fechaRegistro'])); ?></span>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="header-actions">
            <h2>Tickets del Cliente</h2>
            <a href="tickets.php?nuevo&cliente=<?php echo $cliente['id']; ?>" class="btn btn-primary">Nuevo Ticket</a>
        </div>
        
        <?php if ($tickets): ?>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Estado</th>
                    <th>Departamento</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($tickets as $ticket): ?>
                <tr>
                    <td><?php echo htmlspecialchars($ticket['id']); ?></td>
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
        <?php else: ?>
        <p class="text-center text-muted">No hay tickets registrados para este cliente.</p>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>