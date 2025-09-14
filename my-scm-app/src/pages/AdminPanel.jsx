import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  const modules = [
    { title: "📦 Suppliers", description: "Manage supplier records", path: "/psm" },
    { title: "📝 Purchase Orders", description: "Create & track orders", path: "/psm/purchase-orders" },
    { title: "🛒 Products", description: "Manage product catalog", path: "/sws/products" },
    { title: "🏬 Warehouses", description: "Track warehouse stock", path: "/sws/warehouses" },
    { title: "🚚 Logistics", description: "Shipments & deliveries", path: "/logistics" },
    { title: "💼 Assets", description: "Manage company assets lifecycle", path: "/assets" },
    { title: "✉️ Admin Messages", description: "View & manage messages from Get in Touch page", path: "/admin/messages" },
  ];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center px-6"
      style={{ backgroundImage: "url('/images/bg_warehouse.jpg')" }}
    >
      <div className="mt-20 w-full max-w-6xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
          ⚙️ Admin Panel
        </h1>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <button
              key={m.title}
              onClick={() => navigate(m.path)}
              className="group relative p-6 rounded-2xl shadow-lg 
                         bg-white/10 backdrop-blur-md 
                         transition transform hover:scale-[1.03] hover:shadow-2xl"
            >
              {/* Title */}
              <h2 className="text-white text-xl font-semibold">{m.title}</h2>

              {/* Description */}
              <p className="text-gray-200 mt-2 text-sm opacity-80 group-hover:opacity-100 transition">
                {m.description}
              </p>

              {/* Subtle hover outline */}
              <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
