import { Link } from "react-router-dom";

export default function AdminFooter() {
  return (
    <footer className="mt-10 border-t bg-background/60 backdrop-blur-sm">
      <div className="container grid gap-8 py-8 md:grid-cols-3 text-sm">
        
        {/* Branding */}
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
              <span className="text-primary text-lg font-black">⚙️</span>
            </div>
            <span className="text-base font-extrabold tracking-tight">Medizo Admin</span>
          </div>
          <p className="mt-3 text-muted-foreground">
            Manage products, orders, and users efficiently with Medizo Admin Dashboard.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/admin" className="hover:text-primary">Dashboard</Link></li>
            <li><Link to="/admin/products" className="hover:text-primary">Products</Link></li>
            <li><Link to="/admin/orders" className="hover:text-primary">Orders</Link></li>
            <li><Link to="/admin/users" className="hover:text-primary">Users</Link></li>
          </ul>
        </div>

        {/* Contact / Status */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">System Info</h3>
          <p className="text-muted-foreground">Version: <span className="text-foreground font-medium">v2.1.5</span></p>
          <p className="text-muted-foreground">Server Status: <span className="text-green-500 font-semibold">Online</span></p>
          <p className="text-muted-foreground">Last Backup: <span className="text-foreground font-medium">Today, 5:45 PM</span></p>
        </div>
      </div>

      <div className="border-t py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Medizo Admin Panel · All rights reserved · 
        <span className="text-primary ml-1">Developed by Avi ❤️</span>
      </div>
    </footer>
  );
}
