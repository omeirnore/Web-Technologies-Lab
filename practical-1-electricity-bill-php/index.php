<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electricity Bill Calculator</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    body {
      min-height: 100vh;
      margin: 0;
      background: #09090b;
      font-family: 'Inter', system-ui, sans-serif;
      color: #fafafa;
    }

    /* ── Top bar ── */
    .top-bar {
      border-bottom: 1px solid #1c1c1e;
      padding: 1.1rem 0;
      background: #09090b;
    }
    .top-bar .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      font-size: 1.05rem;
      font-weight: 600;
      color: #fafafa;
      letter-spacing: -0.3px;
    }
    .brand span { color: #a1a1aa; font-weight: 400; margin-left: 0.5rem; font-size: 0.85rem; }
    .student-info { color: #52525b; font-size: 0.8rem; letter-spacing: 0.2px; }

    /* ── Layout ── */
    .main-wrap {
      max-width: 960px;
      margin: 0 auto;
      padding: 3rem 1.25rem 4rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 0.35rem;
    }
    .page-sub {
      color: #71717a;
      font-size: 0.9rem;
      margin-bottom: 2.5rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
    }

    /* ── Cards ── */
    .panel {
      background: #111113;
      border: 1px solid #1c1c1e;
      border-radius: 0.75rem;
    }
    .panel-head {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #1c1c1e;
      font-size: 0.8rem;
      font-weight: 600;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .panel-body { padding: 1.5rem; }

    /* ── Form ── */
    label.form-label {
      font-size: 0.82rem;
      font-weight: 500;
      color: #a1a1aa;
      margin-bottom: 0.4rem;
    }
    .form-control {
      background: #09090b;
      border: 1px solid #27272a;
      color: #fafafa;
      border-radius: 0.5rem;
      padding: 0.6rem 0.85rem;
      font-size: 0.9rem;
      transition: border-color 0.15s;
    }
    .form-control::placeholder { color: #3f3f46; }
    .form-control:focus {
      background: #09090b;
      border-color: #fafafa;
      box-shadow: none;
      color: #fafafa;
    }

    .btn-calc {
      background: #fafafa;
      color: #09090b;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.6rem 1.6rem;
      transition: opacity 0.15s;
      cursor: pointer;
    }
    .btn-calc:hover { opacity: 0.85; color: #09090b; }

    .btn-ghost {
      background: transparent;
      color: #71717a;
      border: 1px solid #27272a;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0.6rem 1.6rem;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
    }
    .btn-ghost:hover { color: #a1a1aa; border-color: #3f3f46; }

    /* ── Tariff table ── */
    .slab-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .slab-table th {
      text-align: left;
      color: #52525b;
      font-weight: 500;
      padding: 0.5rem 0;
      border-bottom: 1px solid #1c1c1e;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .slab-table th:last-child { text-align: right; }
    .slab-table td {
      padding: 0.6rem 0;
      color: #a1a1aa;
      border-bottom: 1px solid #1c1c1e;
    }
    .slab-table td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
    .slab-table tr:last-child td { border-bottom: none; }
    .slab-table tr.active-slab td { color: #fafafa; font-weight: 600; }

    /* ── Result ── */
    #result-panel { display: none; }
    .result-amount {
      font-size: 2.75rem;
      font-weight: 700;
      letter-spacing: -1px;
      line-height: 1;
      margin-bottom: 0.25rem;
      font-variant-numeric: tabular-nums;
    }
    .result-meta { color: #52525b; font-size: 0.82rem; margin-bottom: 2rem; }

    .breakdown-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid #1c1c1e;
      font-size: 0.85rem;
    }
    .breakdown-row:last-child { border-bottom: none; }
    .bd-label { color: #71717a; }
    .bd-value { color: #e4e4e7; font-weight: 500; font-variant-numeric: tabular-nums; }

    /* ── Empty state ── */
    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      color: #3f3f46;
      font-size: 0.88rem;
      line-height: 1.7;
    }

    /* ── Validation ── */
    .field-error {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.35rem;
      display: none;
    }
    .error-shake { animation: shake 0.35s ease; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  </style>
</head>
<body>

  <!-- Top bar -->
  <div class="top-bar">
    <div class="container">
      <div class="brand">Electricity Bill Calculator</div>
      <div class="student-info">Omeir Nore &middot; Roll No 61 &middot; PRN 12414006</div>
    </div>
  </div>

  <!-- Main content -->
  <div class="main-wrap">
    <h1 class="page-title">Calculate Your Bill</h1>
    <p class="page-sub">Enter your electricity consumption to get a detailed cost breakdown by slab.</p>

    <div class="grid">

      <!-- Left: Form + Tariff -->
      <div>
        <div class="panel" style="margin-bottom: 1.5rem;">
          <div class="panel-head">Consumption Details</div>
          <div class="panel-body">
            <form id="billForm" method="post" novalidate>
              <div class="mb-3">
                <label for="consumerName" class="form-label">Consumer Name</label>
                <input type="text" class="form-control" id="consumerName" name="consumerName"
                       placeholder="Enter name"
                       value="<?= htmlspecialchars($_POST['consumerName'] ?? '') ?>">
              </div>
              <div class="mb-3">
                <label for="units" class="form-label">Units Consumed (kWh)</label>
                <input type="number" class="form-control" id="units" name="units"
                       placeholder="0" min="0" required
                       value="<?= htmlspecialchars($_POST['units'] ?? '') ?>">
                <div id="unitError" class="field-error">Enter a valid number of units.</div>
              </div>
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn-calc">Calculate</button>
                <button type="button" class="btn-ghost" id="btnReset">Reset</button>
              </div>
            </form>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">Tariff Structure</div>
          <div class="panel-body">
            <table class="slab-table">
              <thead>
                <tr><th>Slab</th><th>Range</th><th>Rate</th></tr>
              </thead>
              <tbody>
                <tr id="slab1"><td>1</td><td>First 50 units</td><td>&#8377; 3.50</td></tr>
                <tr id="slab2"><td>2</td><td>51 – 150 units</td><td>&#8377; 4.00</td></tr>
                <tr id="slab3"><td>3</td><td>151 – 250 units</td><td>&#8377; 5.20</td></tr>
                <tr id="slab4"><td>4</td><td>Above 250 units</td><td>&#8377; 6.50</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right: Result -->
      <div>
        <div id="result-panel" class="panel">
          <div class="panel-head">Bill Summary</div>
          <div class="panel-body">

            <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['units'])) {
                $units = floatval($_POST['units']);
                $name  = trim($_POST['consumerName'] ?? 'Consumer');
                if ($units < 0) $units = 0;

                $remaining = $units;

                $s1Units = min($remaining, 50);
                $s1Cost  = $s1Units * 3.50;
                $remaining -= $s1Units;

                $s2Units = min($remaining, 100);
                $s2Cost  = $s2Units * 4.00;
                $remaining -= $s2Units;

                $s3Units = min($remaining, 100);
                $s3Cost  = $s3Units * 5.20;
                $remaining -= $s3Units;

                $s4Units = $remaining;
                $s4Cost  = $s4Units * 6.50;

                $totalBill = $s1Cost + $s2Cost + $s3Cost + $s4Cost;
            ?>

            <div style="text-align:center; padding-bottom:0.5rem;">
              <div class="result-meta" style="margin-bottom:0.5rem;">Total Amount</div>
              <div class="result-amount">&#8377; <?= number_format($totalBill, 2) ?></div>
              <div class="result-meta"><?= htmlspecialchars($name ?: 'Consumer') ?> &middot; <?= number_format($units) ?> units</div>
            </div>

            <div style="border-top: 1px solid #1c1c1e; padding-top: 0.5rem;">
              <?php if ($s1Units > 0): ?>
              <div class="breakdown-row">
                <span class="bd-label"><?= $s1Units ?> units &times; &#8377;3.50</span>
                <span class="bd-value">&#8377; <?= number_format($s1Cost, 2) ?></span>
              </div>
              <?php endif; ?>
              <?php if ($s2Units > 0): ?>
              <div class="breakdown-row">
                <span class="bd-label"><?= $s2Units ?> units &times; &#8377;4.00</span>
                <span class="bd-value">&#8377; <?= number_format($s2Cost, 2) ?></span>
              </div>
              <?php endif; ?>
              <?php if ($s3Units > 0): ?>
              <div class="breakdown-row">
                <span class="bd-label"><?= $s3Units ?> units &times; &#8377;5.20</span>
                <span class="bd-value">&#8377; <?= number_format($s3Cost, 2) ?></span>
              </div>
              <?php endif; ?>
              <?php if ($s4Units > 0): ?>
              <div class="breakdown-row">
                <span class="bd-label"><?= $s4Units ?> units &times; &#8377;6.50</span>
                <span class="bd-value">&#8377; <?= number_format($s4Cost, 2) ?></span>
              </div>
              <?php endif; ?>
            </div>

            <input type="hidden" id="calcUnits" value="<?= $units ?>">
            <input type="hidden" id="calcDone" value="1">

            <?php } else { ?>
            <input type="hidden" id="calcDone" value="0">
            <div class="empty-state">
              Enter your consumption details<br>and click <strong>Calculate</strong> to view your bill.
            </div>
            <?php } ?>

          </div>
        </div>
      </div>

    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    $(document).ready(function () {

      if ($('#calcDone').val() === '1') {
        $('#result-panel').fadeIn(300);
        var units = parseFloat($('#calcUnits').val()) || 0;
        if (units > 0)   $('#slab1').addClass('active-slab');
        if (units > 50)  $('#slab2').addClass('active-slab');
        if (units > 150) $('#slab3').addClass('active-slab');
        if (units > 250) $('#slab4').addClass('active-slab');
      }

      $('#billForm').on('submit', function (e) {
        var val = $('#units').val().trim();
        if (val === '' || isNaN(val) || parseFloat(val) < 0) {
          e.preventDefault();
          $('#unitError').slideDown(150);
          $('#units').addClass('error-shake');
          setTimeout(function () { $('#units').removeClass('error-shake'); }, 350);
          return false;
        }
        $('#unitError').slideUp(150);
      });

      $('#units').on('input', function () { $('#unitError').slideUp(150); });

      $('#btnReset').on('click', function () {
        $('#consumerName').val('');
        $('#units').val('');
        $('#unitError').slideUp(150);
        $('#result-panel').fadeOut(200);
        $('.active-slab').removeClass('active-slab');
      });
    });
  </script>

</body>
</html>
