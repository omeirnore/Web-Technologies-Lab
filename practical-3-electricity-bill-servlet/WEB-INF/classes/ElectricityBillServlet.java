import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet that calculates electricity bill based on slab rates:
 *   First 50 units  — Rs. 3.50/unit
 *   Next 100 units  — Rs. 4.00/unit
 *   Next 100 units  — Rs. 5.20/unit
 *   Above 250 units — Rs. 6.50/unit
 *
 * @author Omeir Nore (Roll No 61, PRN 12414006)
 */
@WebServlet("/calculate")
public class ElectricityBillServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String consumerName = request.getParameter("consumerName");
        String unitsParam   = request.getParameter("units");

        double units = 0;
        try {
            units = Double.parseDouble(unitsParam);
            if (units < 0) units = 0;
        } catch (NumberFormatException e) {
            units = 0;
        }

        double remaining = units;

        // Slab 1: First 50 units at Rs. 3.50
        double s1Units = Math.min(remaining, 50);
        double s1Cost  = s1Units * 3.50;
        remaining -= s1Units;

        // Slab 2: Next 100 units at Rs. 4.00
        double s2Units = Math.min(remaining, 100);
        double s2Cost  = s2Units * 4.00;
        remaining -= s2Units;

        // Slab 3: Next 100 units at Rs. 5.20
        double s3Units = Math.min(remaining, 100);
        double s3Cost  = s3Units * 5.20;
        remaining -= s3Units;

        // Slab 4: Above 250 units at Rs. 6.50
        double s4Units = remaining;
        double s4Cost  = s4Units * 6.50;

        double totalBill = s1Cost + s2Cost + s3Cost + s4Cost;

        // Set attributes for JSP to render
        request.setAttribute("consumerName", consumerName);
        request.setAttribute("units",    units);
        request.setAttribute("s1Units",  s1Units);
        request.setAttribute("s1Cost",   s1Cost);
        request.setAttribute("s2Units",  s2Units);
        request.setAttribute("s2Cost",   s2Cost);
        request.setAttribute("s3Units",  s3Units);
        request.setAttribute("s3Cost",   s3Cost);
        request.setAttribute("s4Units",  s4Units);
        request.setAttribute("s4Cost",   s4Cost);
        request.setAttribute("totalBill", totalBill);

        // Forward back to index.jsp with results
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Redirect GET requests to the form
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }
}
