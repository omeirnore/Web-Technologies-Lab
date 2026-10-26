<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electricity Bill Calculator</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .hero-header {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      padding: 2rem 0;
      text-align: center;
      color: #fff;
      margin-bottom: 2.5rem;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    }
    .hero-header h1 { font-weight: 700; letter-spacing: -0.5px; }
    .hero-header p  { opacity: 0.9; margin-bottom: 0; }

    .card-calc {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      color: #e2e8f0;
    }
    .card-calc .card-header {
      background: #334155;
      border-radius: 1rem 1rem 0 0;
      font-weight: 600;
      font-size: 1.1rem;
      color: #f8fafc;
    }

    .form-control, .form-control:focus {
      background: #0f172a;
      border: 1px solid #475569;
      color: #f1f5f9;
    }
    .form-control:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 0 0.2rem rgba(245, 158, 11, 0.25);
    }

    .btn-calculate {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none;
      font-weight: 600;
      letter-spacing: 0.3px;
      padding: 0.6rem 2rem;
      color: #fff;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn-calculate:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
      color: #fff;
    }

    .btn-reset {
      background: transparent;
      border: 1px solid #475569;
      color: #94a3b8;
      padding: 0.6rem 2rem;
      font-weight: 600;
    }
    .btn-reset:hover { border-color: #94a3b8; color: #e2e8f0; }

    /* Slab table */
    .table-slabs { color: #cbd5e1; font-size: 0.92rem; }
    .table-slabs th { color: #94a3b8; font-weight: 600; border-color: #334155; }
    .table-slabs td { border-color: #334155; }
    .table-slabs .active-slab { color: #fbbf24; font-weight: 600; }

    /* Result panel */
    #result-panel { display: none; }
    .result-total {
      font-size: 2.5rem;
      font-weight: 700;
      color: #fbbf24;
    }
    .result-label { color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #334155;
      font-size: 0.95rem;
    }
    .breakdown-item:last-child { border-bottom: none; }
    .breakdown-label { color: #94a3b8; }
    .breakdown-value { color: #e2e8f0; font-weight: 500; }

    .student-badge {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      padding: 0.3rem 0.8rem;
      border-radius: 2rem;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    .error-shake { animation: shake 0.4s ease; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="hero-header">
    <div class="container">
      <h1>⚡ Electricity Bill Calculator</h1>
      <p>Calculate your electricity bill based on unit consumption</p>
      <span class="student-badge">Omeir Nore &middot; Roll 61 &middot; PRN 12414006</span>
    </div>
  </div>

  <div class="container pb-5">
    <div class="row g-4 justify-content-center">

      <!-- Left Column: Form + Slab Info -->
      <div class="col-lg-5">
        <div class="card card-calc mb-4">
          <div class="card-header px-4 py-3">📝 Enter Consumption</div>
          <div class="card-body p-4">
            <form id="billForm" method="post" novalidate>
              <div class="mb-3">
                <label for="consumerName" class="form-label">Consumer Name</label>
                <input type="text" class="form-control" id="consumerName" name="consumerName"
                       placeholder="e.g. Omeir Nore"
                       value="<?= htmlspecialchars($_POST['consumerName'] ?? '') ?>">
              </div>
              <div class="mb-3">
                <label for="units" class="form-label">Units Consumed (kWh)</label>
                <input type="number" class="form-control" id="units" name="units"
                       placeholder="Enter units" min="0" required
                       value="<?= htmlspecialchars($_POST['units'] ?? '') ?>">
                <div id="unitError" class="text-danger mt-1" style="font-size:0.85rem; display:none;">
                  Please enter a valid number of units (≥ 0).
                </div>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-calculate">Calculate Bill</button>
                <button type="button" class="btn btn-reset" id="btnReset">Reset</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tariff Slabs -->
        <div class="card card-calc">
          <div class="card-header px-4 py-3">📊 Tariff Slabs</div>
          <div class="card-body p-4">
            <table class="table table-slabs mb-0">
              <thead>
                <tr><th>Slab</th><th>Units</th><th class="text-end">Rate (₹/unit)</th></tr>
              </thead>
              <tbody>
                <tr id="slab1"><td>1</td><td>First 50</td><td class="text-end">3.50</td></tr>
                <tr id="slab2"><td>2</td><td>Next 100</td><td class="text-end">4.00</td></tr>
                <tr id="slab3"><td>3</td><td>Next 100</td><td class="text-end">5.20</td></tr>
                <tr id="slab4"><td>4</td><td>Above 250</td><td class="text-end">6.50</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Result -->
      <div class="col-lg-5">
        <div id="result-panel" class="card card-calc">
          <div class="card-header px-4 py-3">🧾 Bill Summary</div>
          <div class="card-body p-4 text-center">

            <?php
            /**
             * PHP CALCULATION — runs on form submit
             *
             * Slab rates:
             *   First 50 units  → ₹3.50/unit
             *   Next 100 units  → ₹4.00/unit
             *   Next 100 units  → ₹5.20/unit
             *   Above 250 units → ₹6.50/unit
             */
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['units'])) {
                $units = floatval($_POST['units']);
                $name  = trim($_POST['consumerName'] ?? 'Consumer');

                if ($units < 0) {
                    $units = 0;
                }

                $remaining = $units;

                // Slab 1: first 50 units @ 3.50
                $s1Units = min($remaining, 50);
                $s1Cost  = $s1Units * 3.50;
                $remaining -= $s1Units;

                // Slab 2: next 100 units @ 4.00
                $s2Units = min($remaining, 100);
                $s2Cost  = $s2Units * 4.00;
                $remaining -= $s2Units;

                // Slab 3: next 100 units @ 5.20
                $s3Units = min($remaining, 100);
                $s3Cost  = $s3Units * 5.20;
                $remaining -= $s3Units;

                // Slab 4: above 250 @ 6.50
                $s4Units = $remaining;
                $s4Cost  = $s4Units * 6.50;

                $totalBill = $s1Cost + $s2Cost + $s3Cost + $s4Cost;
            ?>

            <div class="result-label mb-1">Total Amount Due</div>
            <div class="result-total mb-1">₹ <?= number_format($totalBill, 2) ?></div>
            <div class="text-secondary mb-4" style="font-size:0.9rem;">
              <?= htmlspecialchars($name ?: 'Consumer') ?> &middot; <?= number_format($units) ?> units
            </div>

            <div class="text-start px-2">
              <?php if ($s1Units > 0): ?>
              <div class="breakdown-item">
                <span class="breakdown-label">Slab 1 — <?= $s1Units ?> units × ₹3.50</span>
                <span class="breakdown-value">₹ <?= number_format($s1Cost, 2) ?></span>
              </div>
              <?php endif; ?>
              <?php if ($s2Units > 0): ?>
              <div class="breakdown-item">
                <span class="breakdown-label">Slab 2 — <?= $s2Units ?> units × ₹4.00</span>
                <span class="breakdown-value">₹ <?= number_format($s2Cost, 2) ?></span>
              </div>
              <?php endif; ?>
              <?php if ($s3Units > 0): ?>
              <div class="breakdown-item">
                <span class="breakdown-label">Slab 3 — <?= $s3Units ?> units × ₹5.20</span>
                <span class="breakdown-value">₹ <?= number_format($s3Cost, 2) ?></span>
              </div>
              <?php endif; ?>
              <?php if ($s4Units > 0): ?>
              <div class="breakdown-item">
                <span class="breakdown-label">Slab 4 — <?= $s4Units ?> units × ₹6.50</span>
                <span class="breakdown-value">₹ <?= number_format($s4Cost, 2) ?></span>
              </div>
              <?php endif; ?>
            </div>

            <!-- Hidden fields for jQuery slab highlighting -->
            <input type="hidden" id="calcUnits" value="<?= $units ?>">
            <input type="hidden" id="calcDone" value="1">

            <?php } else { ?>
            <input type="hidden" id="calcDone" value="0">
            <div class="py-5 text-secondary">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">⚡</div>
              Enter your units consumed and<br>click <strong>Calculate Bill</strong> to see results.
            </div>
            <?php } ?>

          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Bootstrap JS + jQuery -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    $(document).ready(function () {

      // --- Show result panel if PHP computed a result ---
      if ($('#calcDone').val() === '1') {
        $('#result-panel').fadeIn(400);

        // Highlight active slabs in the tariff table
        var units = parseFloat($('#calcUnits').val()) || 0;
        if (units > 0)   $('#slab1').addClass('active-slab');
        if (units > 50)  $('#slab2').addClass('active-slab');
        if (units > 150) $('#slab3').addClass('active-slab');
        if (units > 250) $('#slab4').addClass('active-slab');
      }

      // --- Client-side validation with jQuery ---
      $('#billForm').on('submit', function (e) {
        var val = $('#units').val().trim();
        if (val === '' || isNaN(val) || parseFloat(val) < 0) {
          e.preventDefault();
          $('#unitError').slideDown(200);
          $('#units').addClass('error-shake');
          setTimeout(function () { $('#units').removeClass('error-shake'); }, 400);
          return false;
        }
        $('#unitError').slideUp(200);
      });

      // Hide error on typing
      $('#units').on('input', function () {
        $('#unitError').slideUp(200);
      });

      // --- Reset button ---
      $('#btnReset').on('click', function () {
        $('#consumerName').val('');
        $('#units').val('');
        $('#unitError').slideUp(200);
        $('#result-panel').fadeOut(300);
        $('.active-slab').removeClass('active-slab');
      });
    });
  </script>

</body>
</html>
