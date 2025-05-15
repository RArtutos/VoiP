<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Central Telefónica</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <?php if (isLoggedIn()): ?>
    <nav class="sidebar">
        <div class="sidebar-header">
            <h1>TelDrive</h1>
            <p>Sistema de Soporte</p>
        </div>
        <div class="user-info">
            <p>Agente: <?php echo htmlspecialchars(getCurrentUser()['nombre']); ?></p>
        </div>
        <ul class="nav-links">
            <li><a href="clientes.php">Clientes</a></li>
            <li><a href="tickets.php">Tickets</a></li>
            <li><a href="dashboard.php">Dashboard</a></li>
            <?php if (getCurrentUser()['rol'] === 'admin'): ?>
            <li><a href="agentes.php">Gestionar Agentes</a></li>
            <?php endif; ?>
        </ul>
        <div class="logout-container">
            <form action="logout.php" method="post">
                <button type="submit" class="logout-btn">Cerrar Sesión</button>
            </form>
        </div>
    </nav>
    <main class="content">
    <?php endif; ?>