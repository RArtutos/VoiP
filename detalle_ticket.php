<?php
require_once 'includes/config.php';
requireLogin();

$db = getDB();
$id = $_GET['id'] ?? '';

$ticket = array_filter($db['tickets'], fn($t) => $t['id'] === $id);
$ticket = reset($ticket);

if (!$ticket) {
    header('Location: tickets.php');
    exit;
}

$cliente = array_filter($db['clientes'], fn($c) => $c['id'] === $ticket['clienteId']);
$cliente = reset($cliente);

// Actualizar ticket
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['estado'])) {
        $index = array_search($ticket, $db['tickets']);
        $db['tickets'][$index]['estado'] = $_POST['estado'];
        $db['tickets'][$index]['fechaActualizacion'] = date('c');
        saveDB($db);
        header("Location: detalle_ticket.php?id=$id");
        exit;
    }
    
    if (isset($_POST['nota'])) {
        $index = array_search($ticket, $db['tickets']);
        $db['tickets'][$index]['notas'][] = $_POST['nota'];
        $db['tickets'][$index]['fechaActualizacion'] = date('c');
        saveDB($db);
        header("Location: detalle_ticket.php?id=$id");
        exit;
    }
}

include 'includes/header.php';
?>

<div class="header-actions">
    <a href="tickets.php" class="btn btn-link">&larr; Volver</a>
    <h1>Detalle del Ticket</h1>
</div>

<div class="grid">
    <div class="card">
        <div class="ticket-header">
            <div class="ticket-badges">
                <span class="badge badge-<?php 
                    echo $ticket['estado'] === 'abierto' ? 'danger' : 
                         ($ticket['estado'] === 'en-proceso' ? 'warning' : 
                         ($ticket['estado'] === 'resuelto' ? 'success' : 'secondary')); 
                ?>">
                    <?php echo htmlspecialchars($ticket['estado']); ?>
                </span>
                <span class="badge badge-info">
                    <?php echo htmlspecialchars($ticket['departamento']); ?>
                </span>
            </div>
            <h2>Ticket #<?php echo htmlspecialchars($ticket['id']); ?></h2>
            <p class="text-muted">
                Creado el <?php echo date('d/m/Y H:i', strtotime($ticket['fechaCreacion'])); ?>
            </p>
        </div>

        <div class="ticket-content">
            <h3>Problema</h3>
            <p class="ticket-problema"><?php echo htmlspecialchars($ticket['problema']); ?></p>
            
            <h3>Notas</h3>
            <?php if ($ticket['notas']): ?>
            <ul class="notas-list">
                <?php foreach ($ticket['notas'] as $nota): ?>
                <li class="nota-item"><?php echo htmlspecialchars($nota); ?></li>
                <?php endforeach; ?>
            </ul>
            <?php else: ?>
            <p class="text-muted">No hay notas registradas.</p>
            <?php endif; ?>
            
            <form method="post" class="form-nota">
                <div class="form-group">
                    <label>Agregar Nota</label>
                    <textarea name="nota" class="form-control" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Agregar Nota</button>
            </form>
        </div>
    </div>

    <div class="sidebar-cards">
        <div class="card">
            <h3>Información del Cliente</h3>
            <?php if ($cliente): ?>
            <div class="cliente-info">
                <p class="cliente-nombre"><?php echo htmlspecialchars($cliente['nombre']); ?></p>
                <p class="cliente-numero"><?php echo htmlspecialchars($cliente['numeroCliente']); ?></p>
                <p class="cliente-contacto">
                    Tel: <?php echo htmlspecialchars($cliente['telefono']); ?><br>
                    Email: <?php echo htmlspecialchars($cliente['email']); ?>
                </p>
                <a href="detalle_cliente.php?id=<?php echo $cliente['id']; ?>" class="btn btn-link">
                    Ver perfil completo
                </a>
            </div>
            <?php else: ?>
            <p class="text-muted">Cliente no encontrado</p>
            <?php endif; ?>
        </div>

        <div class="card">
            <h3>Acciones</h3>
            <form method="post" class="form-estado">
                <div class="form-group">
                    <label>Cambiar Estado</label>
                    <select name="estado" class="form-control" onchange="this.form.submit()">
                        <option value="abierto" <?php echo $ticket['estado'] === 'abierto' ? 'selected' : ''; ?>>
                            Abierto
                        </option>
                        <option value="en-proceso" <?php echo $ticket['estado'] === 'en-proceso' ? 'selected' : ''; ?>>
                            En Proceso
                        </option>
                        <option value="resuelto" <?php echo $ticket['estado'] === 'resuelto' ? 'selected' : ''; ?>>
                            Resuelto
                        </option>
                        <option value="cerrado" <?php echo $ticket['estado'] === 'cerrado' ? 'selected' : ''; ?>>
                            Cerrado
                        </option>
                    </select>
                </div>
            </form>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>