<?php
require_once 'includes/config.php';
requireLogin();

$db = getDB();
$tickets = $db['tickets'];
$clientes = $db['clientes'];

// Estadísticas de tickets
$ticketsAbiertos = array_filter($tickets, fn($t) => $t['estado'] === 'abierto');
$ticketsEnProceso = array_filter($tickets, fn($t) => $t['estado'] === 'en-proceso');
$ticketsResueltos = array_filter($tickets, fn($t) => $t['estado'] === 'resuelto');

include 'includes/header.php';
?>

<h1 class="page-title">Dashboard</h1>

<div class="stats-grid">
    <div class="stat-card">
        <h3>Tickets Totales</h3>
        <p class="stat-number"><?php echo count($tickets); ?></p>
    </div>
    
    <div class="stat-card">
        <h3>Tickets Abiertos</h3>
        <p class="stat-number"><?php echo count($ticketsAbiertos); ?></p>
    </div>
    
    <div class="stat-card">
        <h3>En Proceso</h3>
        <p class="stat-number"><?php echo count($ticketsEnProceso); ?></p>
    </div>
    
    <div class="stat-card">
        <h3>Resueltos</h3>
        <p class="stat-number"><?php echo count($ticketsResueltos); ?></p>
    </div>
</div>

<div class="card">
    <h2>Tickets Recientes</h2>
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Departamento</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            <?php 
            $ticketsRecientes = array_slice($tickets, 0, 5);
            foreach ($ticketsRecientes as $ticket):
                $cliente = array_filter($clientes, fn($c) => $c['id'] === $ticket['clienteId']);
                $cliente = reset($cliente);
            ?>
            <tr>
                <td><?php echo htmlspecialchars($ticket['id']); ?></td>
                <td><?php echo htmlspecialchars($cliente['nombre']); ?></td>
                <td><?php echo htmlspecialchars($ticket['estado']); ?></td>
                <td><?php echo htmlspecialchars($ticket['departamento']); ?></td>
                <td><?php echo date('d/m/Y H:i', strtotime($ticket['fechaCreacion'])); ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php include 'includes/footer.php'; ?>