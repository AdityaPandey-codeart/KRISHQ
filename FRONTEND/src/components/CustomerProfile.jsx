
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Truck,
  CheckCircle2,
  Clock3,
  Plus,
  Pencil,
  Trash2,
  Save,
  Leaf,
  ShieldCheck,
  Mail,
  Phone,
  Home,
  Bell,
  Lock,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/Authcontext";

const STORAGE_KEY = "agrikart_customer_data";

const initialLocalData = {
  orders: [
    {
      id: "KRQ-1001",
      date: "28 Aug 2026",
      status: "Delivered",
      total: 1299,
      items: [
        {
          name: "Organic Vermicompost",
          qty: 2,
          price: 499,
        },
        {
          name: "Neem Cake Fertilizer",
          qty: 1,
          price: 301,
        },
      ],
    },
    {
      id: "KRQ-1002",
      date: "31 Aug 2026",
      status: "On the way",
      total: 899,
      items: [
        {
          name: "Premium Garden Soil",
          qty: 2,
          price: 299,
        },
        {
          name: "Plant Growth Booster",
          qty: 1,
          price: 301,
        },
      ],
    },
    {
      id: "KRQ-1003",
      date: "2 Sep 2026",
      status: "Processing",
      total: 599,
      items: [
        {
          name: "Rose Plant",
          qty: 1,
          price: 599,
        },
      ],
    },
  ],

  wishlist: [
    {
      id: 1,
      name: "Premium Rose Plant",
      price: 399,
      category: "Plants",
    },
    {
      id: 2,
      name: "Organic Potting Mix",
      price: 299,
      category: "Soil",
    },
  ],

  addresses: [
    {
      id: 1,
      type: "Home",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "Uttar Pradesh",
      pincode: "",
      isDefault: true,
    },
  ],

  settings: {
    orderUpdates: true,
    promotionalEmails: false,
    promotionalNotifications: true,
  },
};

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: User,
  },
  {
    id: "orders",
    label: "Orders",
    icon: Package,
  },
  {
    id: "services",
    label: "Services",
    icon: Leaf,
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

function getInitials(name = "", email = "") {
  const source =
    name.trim() || email.split("@")[0] || "User";

  const parts = source
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getDisplayName(user) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "KRISHQ User"
  );
}

function getAvatar(user) {
  return (
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null
  );
}

function loadLocalData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialLocalData;
    }

    const parsed = JSON.parse(saved);

    return {
      ...initialLocalData,
      ...parsed,
      orders:
        parsed.orders || initialLocalData.orders,
      wishlist:
        parsed.wishlist || initialLocalData.wishlist,
      addresses:
        parsed.addresses || initialLocalData.addresses,
      settings: {
        ...initialLocalData.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load profile data:",
      error
    );

    return initialLocalData;
  }
}

function saveLocalData(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      "Failed to save profile data:",
      error
    );
  }
}

function StatusIcon({ status }) {
  if (status === "Delivered") {
    return <CheckCircle2 size={16} />;
  }

  if (status === "On the way") {
    return <Truck size={16} />;
  }

  return <Clock3 size={16} />;
}

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
        <Icon size={28} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ProfileHeader({
  user,
  onClose,
  onLogout,
}) {
  const name = getDisplayName(user);
  const email = user?.email || "";
  const avatar = getAvatar(user);
  const initials = getInitials(name, email);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 px-6 pb-6 pt-5 text-white">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-white/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-green-100">
            KRISHQ Account
          </p>

          <h2 className="mt-1 text-xl font-bold">
            My Profile
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 transition hover:bg-white/10"
          aria-label="Close profile"
        >
          <X size={21} />
        </button>
      </div>

      <div className="relative mt-6 flex items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-16 w-16 rounded-full border-2 border-white/70 object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/70 bg-white text-lg font-bold text-green-700 shadow-lg">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold">
            {name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-green-100">
            <Mail size={14} />

            <span className="truncate">
              {email || "Email not available"}
            </span>
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <ShieldCheck size={13} />
            Verified Account
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-sm font-semibold transition hover:bg-white/20"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}

function OverviewTab({
  user,
  data,
  setActiveTab,
}) {
  const name = getDisplayName(user);

  const deliveredOrders = data.orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const wishlistCount = data.wishlist.length;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-500">
          Welcome back,
        </p>

        <h3 className="text-2xl font-bold text-gray-900">
          {name}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <Package
            size={19}
            className="text-green-600"
          />

          <p className="mt-3 text-xl font-bold text-gray-900">
            {data.orders.length}
          </p>

          <p className="text-xs text-gray-500">
            Orders
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <CheckCircle2
            size={19}
            className="text-green-600"
          />

          <p className="mt-3 text-xl font-bold text-gray-900">
            {deliveredOrders}
          </p>

          <p className="text-xs text-gray-500">
            Delivered
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <Heart
            size={19}
            className="text-red-500"
          />

          <p className="mt-3 text-xl font-bold text-gray-900">
            {wishlistCount}
          </p>

          <p className="text-xs text-gray-500">
            Wishlist
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
            <Leaf size={20} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-900">
              Grow better with KRISHQ
            </h4>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Explore plants, fertilizers, farming
              products and professional gardening
              services from one place.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-gray-900">
          Quick Actions
        </h4>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50"
          >
            <span className="flex items-center gap-3">
              <Package
                size={18}
                className="text-green-600"
              />

              <span className="text-sm font-medium">
                View My Orders
              </span>
            </span>

            <ChevronRight size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("addresses")
            }
            className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50"
          >
            <span className="flex items-center gap-3">
              <MapPin
                size={18}
                className="text-green-600"
              />

              <span className="text-sm font-medium">
                Manage Addresses
              </span>
            </span>

            <ChevronRight size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("wishlist")
            }
            className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50"
          >
            <span className="flex items-center gap-3">
              <Heart
                size={18}
                className="text-green-600"
              />

              <span className="text-sm font-medium">
                My Wishlist
              </span>
            </span>

            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({
  orders,
  expandedOrder,
  setExpandedOrder,
  orderFilter,
  setOrderFilter,
}) {
  const filters = [
    "All",
    "Processing",
    "On the way",
    "Delivered",
  ];

  const filteredOrders =
    orderFilter === "All"
      ? orders
      : orders.filter(
          (order) => order.status === orderFilter
        );

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          My Orders
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Track and manage your KRISHQ orders.
        </p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() =>
              setOrderFilter(filter)
            }
            className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              orderFilter === filter
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="Your orders will appear here once you place an order."
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded =
              expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedOrder(
                      isExpanded ? null : order.id
                    )
                  }
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {order.id}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status ===
                              "On the way"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        <StatusIcon
                          status={order.status}
                        />

                        {order.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.date} · ₹
                      {order.total.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  {isExpanded ? (
                    <ChevronDown
                      size={18}
                      className="text-gray-500"
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-gray-500"
                    />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Items
                        </p>

                        <div className="space-y-2">
                          {order.items.map(
                            (item, index) => (
                              <div
                                key={`${item.name}-${index}`}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-600">
                                  {item.name} × {item.qty}
                                </span>

                                <span className="font-medium text-gray-900">
                                  ₹
                                  {(
                                    item.price *
                                    item.qty
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                          <span className="font-semibold text-gray-900">
                            Total
                          </span>

                          <span className="font-bold text-green-700">
                            ₹
                            {order.total.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ServicesTab() {
  const services = [
    {
      title: "Polyhouse Installation",
      description:
        "Professional polyhouse setup and planning.",
    },
    {
      title: "Garden & Lawn Setup",
      description:
        "Complete lawn and garden development solutions.",
    },
    {
      title: "Terrace Farming",
      description:
        "Plan and build productive terrace gardens.",
    },
    {
      title: "Multiple Cropping",
      description:
        "Smart crop planning for better farm utilization.",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900">
          KRISHQ Services
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Professional agricultural and landscaping
          solutions.
        </p>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-2xl border border-gray-100 p-4 transition hover:border-green-200 hover:bg-green-50"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Leaf size={18} />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  {service.title}
                </h4>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressesTab({
  addresses,
  setAddresses,
}) {
  const emptyForm = {
    id: null,
    type: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
    isDefault: false,
  };

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);

    setForm({
      ...emptyForm,
      ...address,
    });

    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      toast.error(
        "Please fill the required address fields."
      );

      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((address) =>
          address.id === editingId
            ? {
                ...form,
                id: editingId,
              }
            : address
        )
      );

      toast.success("Address updated.");
    } else {
      const newAddress = {
        ...form,
        id: Date.now(),
        isDefault:
          addresses.length === 0
            ? true
            : form.isDefault,
      };

      setAddresses((prev) => [
        ...prev,
        newAddress,
      ]);

      toast.success("Address added.");
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteAddress = (id) => {
    const target = addresses.find(
      (address) => address.id === id
    );

    if (!target) return;

    const remaining = addresses.filter(
      (address) => address.id !== id
    );

    if (
      target.isDefault &&
      remaining.length > 0
    ) {
      remaining[0] = {
        ...remaining[0],
        isDefault: true,
      };
    }

    setAddresses(remaining);

    toast.success("Address deleted.");
  };

  const makeDefault = (id) => {
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );

    toast.success("Default address updated.");
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Saved Addresses
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your delivery addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            onSubmit={handleSave}
            className="mb-5 rounded-2xl border border-green-100 bg-green-50 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                {editingId
                  ? "Edit Address"
                  : "Add New Address"}
              </h4>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name *"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City *"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />

              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode *"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Complete address *"
                rows={3}
                className="col-span-2 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                id="default-address"
                type="checkbox"
                checked={Boolean(form.isDefault)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isDefault:
                      event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-green-600"
              />

              <label
                htmlFor="default-address"
                className="text-xs text-gray-600"
              >
                Make this my default address
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Save size={16} />
              Save Address
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Add a delivery address to make checkout faster."
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    {address.type === "Home" ? (
                      <Home size={18} />
                    ) : (
                      <MapPin size={18} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {address.type ||
                          "Address"}
                      </h4>

                      {address.isDefault && (
                        <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {address.name}
                    </p>

                    {address.phone && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={12} />
                        {address.phone}
                      </p>
                    )}

                    <p className="mt-2 text-sm leading-5 text-gray-500">
                      {address.address ||
                        "Address not added"}

                      {address.city
                        ? `, ${address.city}`
                        : ""}

                      {address.state
                        ? `, ${address.state}`
                        : ""}

                      {address.pincode
                        ? ` - ${address.pincode}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(address)
                    }
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Edit address"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteAddress(address.id)
                    }
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() =>
                    makeDefault(address.id)
                  }
                  className="mt-3 text-xs font-semibold text-green-700 hover:underline"
                >
                  Make default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistTab({
  wishlist,
  setWishlist,
}) {
  const removeItem = (id) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== id)
    );

    toast.success("Removed from wishlist.");
  };

  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save products you love and find them here later."
      />
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900">
          My Wishlist
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Products you've saved for later.
        </p>
      </div>

      <div className="space-y-3">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Leaf size={20} />
              </div>

              <div className="min-w-0">
                <h4 className="truncate font-semibold text-gray-900">
                  {item.name}
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  {item.category || "Product"}
                </p>

                <p className="mt-1 font-bold text-green-700">
                  ₹
                  {item.price.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() =>
                  toast(
                    "Add to cart will be connected with the main cart."
                  )
                }
                className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
              >
                Add
              </button>

              <button
                type="button"
                onClick={() =>
                  removeItem(item.id)
                }
                className="rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove wishlist item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  setSettings,
}) {
  const settingItems = [
    {
      key: "orderUpdates",
      title: "Order Updates",
      description:
        "Receive notifications about your orders.",
      icon: Package,
    },
    {
      key: "promotionalEmails",
      title: "Promotional Emails",
      description:
        "Receive offers and product recommendations by email.",
      icon: Mail,
    },
    {
      key: "promotionalNotifications",
      title: "Promotional Notifications",
      description:
        "Receive useful deals and KRISHQ updates.",
      icon: Bell,
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900">
          Settings
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences.
        </p>
      </div>

      <div className="space-y-3">
        {settingItems.map(
          ({
            key,
            title,
            description,
            icon: Icon,
          }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex min-w-0 gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
                  <Icon size={18} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {title}
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(
                  settings[key]
                )}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  settings[key]
                    ? "bg-green-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    settings[key]
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          )
        )}
      </div>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() =>
            toast(
              "Password management will be connected with Supabase Auth."
            )
          }
          className="flex w-full items-center justify-between rounded-2xl border border-gray-100 p-4 text-left transition hover:bg-gray-50"
        >
          <span className="flex items-center gap-3">
            <Lock
              size={18}
              className="text-gray-600"
            />

            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Password & Security
              </span>

              <span className="mt-1 block text-xs text-gray-500">
                Manage your account security.
              </span>
            </span>
          </span>

          <ChevronRight size={17} />
        </button>

        <button
          type="button"
          onClick={() =>
            toast(
              "Help & support section will be connected soon."
            )
          }
          className="flex w-full items-center justify-between rounded-2xl border border-gray-100 p-4 text-left transition hover:bg-gray-50"
        >
          <span className="flex items-center gap-3">
            <HelpCircle
              size={18}
              className="text-gray-600"
            />

            <span>
              <span className="block text-sm font-semibold text-gray-900">
                Help & Support
              </span>

              <span className="mt-1 block text-xs text-gray-500">
                Need help with your KRISHQ account?
              </span>
            </span>
          </span>

          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default function ProfileWidget({
  isOpen: controlledIsOpen,
  onOpen,
  onClose,
  onLogout,
  user: propUser,
}) {
  const { user: authUser, signOut } = useAuth();

  const currentUser = propUser || authUser;

  /*
   * Profile can work in two modes:
   *
   * 1. Controlled mode:
   *    App.jsx sends isOpen + onClose.
   *
   * 2. Standalone mode:
   *    This component manages its own open/close state.
   */
  const [internalOpen, setInternalOpen] =
    useState(false);

  const isControlled =
    typeof controlledIsOpen === "boolean";

  const isOpen = isControlled
    ? controlledIsOpen
    : internalOpen;

  const openProfile = () => {
    if (typeof onOpen === "function") {
      onOpen();
    } else {
      setInternalOpen(true);
    }
  };

  const closeProfile = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const [data, setData] = useState(
    loadLocalData
  );

  const [activeTab, setActiveTab] =
    useState("overview");

  const [expandedOrder, setExpandedOrder] =
    useState(null);

  const [orderFilter, setOrderFilter] =
    useState("All");

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  useEffect(() => {
    saveLocalData(data);
  }, [data]);

  useEffect(() => {
    if (!isOpen) {
      setShowLogoutConfirm(false);
    }
  }, [isOpen]);

  const updateAddresses = (updater) => {
    setData((prev) => ({
      ...prev,
      addresses:
        typeof updater === "function"
          ? updater(prev.addresses)
          : updater,
    }));
  };

  const updateWishlist = (updater) => {
    setData((prev) => ({
      ...prev,
      wishlist:
        typeof updater === "function"
          ? updater(prev.wishlist)
          : updater,
    }));
  };

  const updateSettings = (updater) => {
    setData((prev) => ({
      ...prev,
      settings:
        typeof updater === "function"
          ? updater(prev.settings)
          : updater,
    }));
  };

  const handleLogoutRequest = () => {
    if (logoutLoading) return;

    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      const { error } = await signOut();

      if (error) {
        toast.error(
          error.message || "Logout failed."
        );

        return;
      }

      localStorage.removeItem(STORAGE_KEY);

      setShowLogoutConfirm(false);

      toast.success(
        "Logged out successfully."
      );

      closeProfile();

      if (typeof onLogout === "function") {
        onLogout();
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      toast.error(
        "Something went wrong while logging out."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const content = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            user={currentUser}
            data={data}
            setActiveTab={setActiveTab}
          />
        );

      case "orders":
        return (
          <OrdersTab
            orders={data.orders}
            expandedOrder={expandedOrder}
            setExpandedOrder={setExpandedOrder}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
          />
        );

      case "services":
        return <ServicesTab />;

      case "addresses":
        return (
          <AddressesTab
            addresses={data.addresses}
            setAddresses={updateAddresses}
          />
        );

      case "wishlist":
        return (
          <WishlistTab
            wishlist={data.wishlist}
            setWishlist={updateWishlist}
          />
        );

      case "settings":
        return (
          <SettingsTab
            settings={data.settings}
            setSettings={updateSettings}
          />
        );

      default:
        return null;
    }
  }, [
    activeTab,
    currentUser,
    data,
    expandedOrder,
    orderFilter,
  ]);

  const avatar = getAvatar(currentUser);
  const displayName = getDisplayName(
    currentUser
  );
  const initials = getInitials(
    displayName,
    currentUser?.email
  );

  return (
    <>
      {/* ================================
          CUSTOMER PROFILE FLOATING ICON
          ================================ */}
      <button
        type="button"
        onClick={openProfile}
        className="fixed left-5 top-5 z-[9997] flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-green-600 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        aria-label="Open customer profile"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {/* ================================
          PROFILE PANEL
          ================================ */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeProfile}
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]"
            />

            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="fixed right-0 top-0 z-[9999] flex h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl"
            >
              <ProfileHeader
                user={currentUser}
                onClose={closeProfile}
                onLogout={
                  handleLogoutRequest
                }
              />

              <div className="border-b border-gray-100 bg-white px-3">
                <div className="flex gap-1 overflow-x-auto py-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;

                    const active =
                      activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setActiveTab(tab.id)
                        }
                        className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          active
                            ? "bg-green-50 text-green-700"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                      >
                        <Icon size={14} />

                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-white px-5 py-5">
                {content}
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                  <ShieldCheck size={13} />

                  Your account is protected by
                  Supabase Auth
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================================
          LOGOUT CONFIRMATION
          ================================ */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <LogOut size={21} />
              </div>

              <h3 className="mt-4 text-center text-lg font-bold text-gray-900">
                Logout from KRISHQ?
              </h3>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                You will need to login again to
                access your KRISHQ account.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowLogoutConfirm(false)
                  }
                  disabled={logoutLoading}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {logoutLoading
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}