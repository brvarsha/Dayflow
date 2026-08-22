// Mock Database
const db = {
    users: [
        { id: 'DA-JD-2024-001', name: 'John Doe', role: 'Admin', email: 'admin@dayflow.com', password: 'password123', baseSalary: 80000, status: 'present' },
        { id: 'DA-AS-2024-002', name: 'Alice Smith', role: 'Employee', email: 'alice@dayflow.com', password: 'password123', baseSalary: 50000, status: 'absent' },
        { id: 'DA-BJ-2024-003', name: 'Bob Jones', role: 'Employee', email: 'bob@dayflow.com', password: 'password123', baseSalary: 55000, status: 'leave' }
    ],
    currentUser: null,
    attendance: [
        { userId: 'DA-AS-2024-002', date: '2026-08-21', checkIn: '09:00', checkOut: '17:30', totalHours: '8h 30m', extraHours: '0h 30m', status: 'Present' },
        { userId: 'DA-AS-2024-002', date: '2026-08-20', checkIn: '09:15', checkOut: '17:00', totalHours: '7h 45m', extraHours: '-0h 15m', status: 'Present' }
    ],
    leaveRequests: [
        { id: 1, userId: 'DA-AS-2024-002', name: 'Alice Smith', type: 'Sick Leave', duration: 'Oct 12 - Oct 13', status: 'Pending' },
        { id: 2, userId: 'DA-BJ-2024-003', name: 'Bob Jones', type: 'Annual Leave', duration: 'Oct 20 - Oct 25', status: 'Approved' }
    ],
    checkInState: null // 'checked-in', null
};

// Generate ID Helper
function generateId(company, name, year, serial) {
    const nameInitials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `${company.substring(0,2).toUpperCase()}-${nameInitials}-${year}-${String(serial).padStart(3, '0')}`;
}

// App State
let currentRoute = '#login';

// Router
function render() {
    const app = document.getElementById('app');
    
    if (!db.currentUser && currentRoute !== '#login' && currentRoute !== '#register') {
        window.location.hash = '#login';
        return;
    }

    if (db.currentUser && (currentRoute === '#login' || currentRoute === '#register')) {
        window.location.hash = '#dashboard';
        return;
    }

    switch(currentRoute) {
        case '#login': app.innerHTML = LoginView(); break;
        case '#register': app.innerHTML = RegisterView(); break;
        case '#dashboard': app.innerHTML = Layout(DashboardView()); break;
        case '#profile': app.innerHTML = Layout(ProfileView()); break;
        case '#attendance': app.innerHTML = Layout(AttendanceView()); break;
        case '#leave': app.innerHTML = Layout(LeaveView()); break;
        default: app.innerHTML = Layout(DashboardView()); break;
    }
    
    lucide.createIcons();
    attachEventListeners();
}

window.addEventListener('hashchange', () => {
    currentRoute = window.location.hash || '#login';
    render();
});

// Views
function LoginView() {
    return `
    <div class="min-h-screen flex items-center justify-center fade-in bg-background">
        <div class="card p-8 w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-primary mb-2">Dayflow</h1>
                <p class="text-slate">Every workday, perfectly aligned.</p>
            </div>
            <form id="loginForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-navy mb-1">Email or Login ID</label>
                    <input type="text" id="email" class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" value="admin@dayflow.com" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-navy mb-1">Password</label>
                    <input type="password" id="password" class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" value="password123" required>
                </div>
                <div class="flex items-center justify-between text-sm">
                    <label class="flex items-center text-slate cursor-pointer"><input type="checkbox" class="mr-2 rounded text-primary border-border focus:ring-primary"> Remember me</label>
                    <a href="#" class="text-primary hover:underline">Forgot password?</a>
                </div>
                <button type="submit" class="btn w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-hover">Sign In</button>
            </form>
            <p class="text-center mt-6 text-sm text-slate">
                Don't have an account? <a href="#register" class="text-primary hover:underline font-medium">Register</a>
            </p>
            <div class="mt-4 pt-4 border-t border-border text-center text-xs text-slate">
                Quick Login: <button id="quickAdmin" class="text-primary hover:underline mx-1">Admin</button> | <button id="quickEmp" class="text-primary hover:underline mx-1">Employee</button>
            </div>
        </div>
    </div>`;
}

function RegisterView() {
    return `
    <div class="min-h-screen flex items-center justify-center fade-in bg-background py-8">
        <div class="card p-8 w-full max-w-md">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-primary mb-1">Join Dayflow</h1>
                <p class="text-slate text-sm">Create your employee account</p>
            </div>
            <form id="registerForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-navy mb-1">Full Name</label>
                    <input type="text" id="regName" class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-navy mb-1">Email</label>
                    <input type="email" id="regEmail" class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-navy mb-1">Role</label>
                    <select id="regRole" class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary">
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-navy mb-1">Password</label>
                    <input type="password" id="regPassword" class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary" required>
                </div>
                <button type="submit" class="btn w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-hover">Register</button>
            </form>
            <p class="text-center mt-6 text-sm text-slate">
                Already have an account? <a href="#login" class="text-primary hover:underline font-medium">Sign In</a>
            </p>
        </div>
    </div>`;
}

function Layout(content) {
    const isAdmin = db.currentUser.role === 'Admin';
    const navItems = [
        { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
        { id: 'profile', icon: 'user', label: 'Profile' },
        { id: 'attendance', icon: 'clock', label: 'Attendance' },
        { id: 'leave', icon: 'calendar', label: 'Leave' },
    ];

    return `
    <div class="app-container fade-in">
        <!-- Sidebar -->
        <aside class="sidebar p-4 hidden md:flex">
            <div class="mb-8 px-4 flex items-center">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold mr-3">D</div>
                <div>
                    <h1 class="text-xl font-bold text-navy leading-none">Dayflow</h1>
                    <p class="text-[10px] text-slate mt-1 tracking-wider uppercase">${db.currentUser.role}</p>
                </div>
            </div>
            <nav class="space-y-1.5 flex-grow">
                ${navItems.map(item => `
                    <a href="#${item.id}" class="flex items-center px-4 py-2.5 rounded-lg text-sm text-navy hover:bg-gray-50 transition-colors ${currentRoute === '#' + item.id ? 'sidebar-active font-medium' : ''}">
                        <i data-lucide="${item.icon}" class="w-5 h-5 mr-3 ${currentRoute === '#' + item.id ? 'text-primary' : 'text-slate'}"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </nav>
            <div class="pt-4 border-t border-border mt-auto">
                <div class="flex items-center px-4 py-2 mb-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3 shadow-sm">
                        ${db.currentUser.name.charAt(0)}
                    </div>
                    <div class="flex-grow overflow-hidden">
                        <p class="text-sm font-semibold text-navy truncate">${db.currentUser.name}</p>
                        <p class="text-xs text-slate truncate">${db.currentUser.id}</p>
                    </div>
                </div>
                <button id="logoutBtn" class="flex items-center w-full px-4 py-2 text-slate hover:text-error hover:bg-red-50 rounded-lg transition-colors text-sm">
                    <i data-lucide="log-out" class="w-5 h-5 mr-3"></i>
                    <span class="font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content bg-background slide-up flex flex-col relative">
            <header class="flex justify-between items-center mb-8 md:hidden">
                <h1 class="text-xl font-bold text-primary">Dayflow</h1>
                <button class="p-2 text-navy"><i data-lucide="menu" class="w-6 h-6"></i></button>
            </header>
            <div class="flex-grow pb-24">
                ${content}
            </div>
            
            <!-- Check-in Systray (Sticky at bottom right) -->
            <div class="fixed bottom-6 right-6 z-50">
                <div class="card p-4 flex items-center space-x-4 shadow-lg border-primary/20">
                    <div>
                        <p class="text-xs text-slate uppercase font-medium">Daily Attendance</p>
                        <p class="text-sm font-bold text-navy" id="systrayTime">09:00 AM</p>
                    </div>
                    <button id="systrayActionBtn" class="btn ${db.checkInState === 'checked-in' ? 'bg-error hover:bg-red-600' : 'bg-secondary hover:bg-teal-600'} text-white px-4 py-2 rounded-lg font-medium flex items-center text-sm transition-colors shadow-sm">
                        <i data-lucide="${db.checkInState === 'checked-in' ? 'log-out' : 'check-circle'}" class="w-4 h-4 mr-2"></i> 
                        ${db.checkInState === 'checked-in' ? 'Check Out' : 'Check In'}
                    </button>
                </div>
            </div>
        </main>
    </div>`;
}

function getStatusIcon(status) {
    if(status === 'present') return '<span class="w-3 h-3 rounded-full bg-success border-2 border-white absolute -bottom-1 -right-1"></span>';
    if(status === 'absent') return '<span class="w-3 h-3 rounded-full bg-warning border-2 border-white absolute -bottom-1 -right-1"></span>';
    if(status === 'leave') return '<div class="absolute -bottom-1 -right-1 bg-white rounded-full"><i data-lucide="plane" class="w-3.5 h-3.5 text-blue-500"></i></div>';
    return '';
}

function DashboardView() {
    const isAdmin = db.currentUser.role === 'Admin';
    
    let content = `
    <div class="flex justify-between items-end mb-8">
        <div>
            <h2 class="text-2xl font-bold text-navy">Welcome back, ${db.currentUser.name}</h2>
            <p class="text-slate mt-1">Here's your overview for today.</p>
        </div>
        <div class="flex items-center space-x-3 hidden sm:flex">
            <button class="p-2.5 rounded-full bg-white border border-border text-slate hover:text-primary transition-colors shadow-sm">
                <i data-lucide="bell" class="w-5 h-5"></i>
            </button>
            <button class="p-2.5 rounded-full bg-white border border-border text-slate hover:text-primary transition-colors shadow-sm">
                <i data-lucide="search" class="w-5 h-5"></i>
            </button>
        </div>
    </div>`;

    if (isAdmin) {
        content += `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            ${['Total Employees|users|' + db.users.length, 'Present Today|user-check|' + db.users.filter(u=>u.status==='present').length, 'On Leave|plane|' + db.users.filter(u=>u.status==='leave').length, 'Pending Approvals|clock|' + db.leaveRequests.filter(r=>r.status==='Pending').length].map((stat, i) => {
                const [label, icon, val] = stat.split('|');
                return `
                <div class="card p-6 card-hover" style="animation: slideUp 0.4s ease-out ${i*80}ms forwards; opacity: 0;">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-lg text-primary">
                            <i data-lucide="${icon}" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold text-navy mb-1">${val}</h3>
                    <p class="text-sm text-slate font-medium">${label}</p>
                </div>`
            }).join('')}
        </div>
        
        <div class="flex justify-between items-center mb-4 mt-8">
            <h3 class="text-lg font-bold text-navy">Team Status</h3>
            <button class="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${db.users.map((u, index) => `
            <div class="card p-5 flex items-center justify-between cursor-pointer hover:border-primary transition-all card-hover" style="animation: slideUp 0.4s ease-out ${index*100}ms forwards; opacity: 0;">
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold mr-4 relative text-lg shadow-inner">
                        ${u.name.charAt(0)}
                        ${getStatusIcon(u.status)}
                    </div>
                    <div>
                        <p class="font-semibold text-navy text-sm">${u.name}</p>
                        <p class="text-xs text-slate mt-0.5">${u.role} &bull; ${u.id}</p>
                    </div>
                </div>
                <button class="text-slate hover:text-primary transition-colors p-1"><i data-lucide="more-vertical" class="w-5 h-5"></i></button>
            </div>
            `).join('')}
        </div>
        `;
    } else {
        content += `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="card p-6">
                <h3 class="text-lg font-bold text-navy mb-4">Your Attendance Today</h3>
                <div class="flex flex-col space-y-4">
                    <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-border">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-green-100 text-success flex items-center justify-center mr-3">
                                <i data-lucide="log-in" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-xs text-slate uppercase font-medium">Check In</p>
                                <p class="font-bold text-navy text-lg">09:00 AM</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-border">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-red-100 text-error flex items-center justify-center mr-3">
                                <i data-lucide="log-out" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-xs text-slate uppercase font-medium">Check Out</p>
                                <p class="font-bold text-navy text-lg">--:--</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card p-6">
                <h3 class="text-lg font-bold text-navy mb-4">Upcoming Leave</h3>
                <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-5 flex flex-col items-center justify-center text-center h-40">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-3">
                        <i data-lucide="calendar" class="w-6 h-6"></i>
                    </div>
                    <p class="font-medium text-navy">No upcoming leave scheduled.</p>
                    <a href="#leave" class="text-primary text-sm mt-2 hover:underline font-medium">Apply for time off</a>
                </div>
            </div>
        </div>
        `;
    }

    return content;
}

function ProfileView() {
    const isAdmin = db.currentUser.role === 'Admin';
    const user = db.currentUser;
    
    // Salary Calculation (Fixed base, auto calculated components)
    const base = user.baseSalary || 50000;
    const hra = base * 0.4;
    const pf = base * 0.12;
    const tax = base * 0.1;
    const net = base + hra - pf - tax;

    let salaryTab = '';
    if (isAdmin) {
        salaryTab = `
        <div class="mt-8 card overflow-hidden slide-up" style="animation-delay: 150ms;">
            <div class="px-6 py-4 border-b border-border bg-gray-50">
                <h3 class="text-lg font-bold text-navy flex items-center">
                    <i data-lucide="dollar-sign" class="w-5 h-5 mr-2 text-primary"></i>
                    Salary Information (Admin Only)
                </h3>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="p-4 border border-border rounded-lg">
                        <p class="text-xs text-slate uppercase font-medium mb-1 tracking-wide">Base Salary</p>
                        <p class="text-2xl font-bold text-navy">$${base.toLocaleString()}</p>
                        <p class="text-xs text-slate mt-1">Fixed monthly wage</p>
                    </div>
                    <div class="p-4 border border-border rounded-lg bg-green-50/30">
                        <p class="text-xs text-slate uppercase font-medium mb-1 tracking-wide">HRA (40%)</p>
                        <p class="text-2xl font-bold text-success">+$${hra.toLocaleString()}</p>
                        <p class="text-xs text-slate mt-1">House Rent Allowance</p>
                    </div>
                    <div class="p-4 border border-border rounded-lg bg-red-50/30">
                        <p class="text-xs text-slate uppercase font-medium mb-1 tracking-wide">PF (12%)</p>
                        <p class="text-2xl font-bold text-error">-$${pf.toLocaleString()}</p>
                        <p class="text-xs text-slate mt-1">Provident Fund</p>
                    </div>
                    <div class="p-4 border border-border rounded-lg bg-red-50/30">
                        <p class="text-xs text-slate uppercase font-medium mb-1 tracking-wide">Taxes (10%)</p>
                        <p class="text-2xl font-bold text-error">-$${tax.toLocaleString()}</p>
                        <p class="text-xs text-slate mt-1">Income Tax</p>
                    </div>
                </div>
                <div class="mt-6 p-5 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex justify-between items-center text-white shadow-md">
                    <div>
                        <p class="text-sm text-indigo-100 font-medium tracking-wide uppercase">Net Monthly Salary</p>
                        <p class="text-3xl font-bold mt-1">$${net.toLocaleString()}</p>
                    </div>
                    <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <i data-lucide="wallet" class="w-6 h-6"></i>
                    </div>
                </div>
            </div>
        </div>`;
    }

    return `
    <div class="max-w-5xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-navy">Employee Profile</h2>
            <button class="btn bg-white border border-border text-navy px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm">
                <i data-lucide="edit-2" class="w-4 h-4 mr-2"></i> Edit Profile
            </button>
        </div>
        
        <div class="card p-8 flex flex-col md:flex-row items-start md:space-x-8 slide-up">
            <div class="relative mb-6 md:mb-0 group cursor-pointer">
                <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-teal-400 text-white flex items-center justify-center text-5xl font-bold shadow-lg transition-transform group-hover:scale-105 duration-300">
                    ${user.name.charAt(0)}
                </div>
                <div class="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <i data-lucide="camera" class="w-8 h-8 text-white"></i>
                </div>
            </div>
            
            <div class="flex-grow w-full">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-4 mb-6">
                    <div>
                        <h3 class="text-3xl font-bold text-navy">${user.name}</h3>
                        <p class="text-primary font-medium mt-1 flex items-center">
                            <i data-lucide="briefcase" class="w-4 h-4 mr-1.5"></i> ${user.role}
                        </p>
                    </div>
                    <div class="mt-4 md:mt-0 text-right">
                        <p class="text-xs text-slate uppercase font-medium tracking-wide">Login ID</p>
                        <p class="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded text-navy mt-1 border border-border">${user.id}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <p class="text-xs text-slate uppercase font-medium tracking-wide mb-1 flex items-center">
                            <i data-lucide="mail" class="w-3.5 h-3.5 mr-1.5"></i> Email Address
                        </p>
                        <p class="font-medium text-navy">${user.email}</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate uppercase font-medium tracking-wide mb-1 flex items-center">
                            <i data-lucide="phone" class="w-3.5 h-3.5 mr-1.5"></i> Phone Number
                        </p>
                        <p class="font-medium text-navy">+1 (555) 123-4567</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate uppercase font-medium tracking-wide mb-1 flex items-center">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1.5"></i> Location
                        </p>
                        <p class="font-medium text-navy">New York, USA</p>
                    </div>
                    <div>
                        <p class="text-xs text-slate uppercase font-medium tracking-wide mb-1 flex items-center">
                            <i data-lucide="calendar-check" class="w-3.5 h-3.5 mr-1.5"></i> Joined Date
                        </p>
                        <p class="font-medium text-navy">Jan 15, 2024</p>
                    </div>
                </div>
            </div>
        </div>
        ${salaryTab}
    </div>`;
}

function AttendanceView() {
    return `
    <div>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 class="text-2xl font-bold text-navy">Attendance Records</h2>
            <div class="flex space-x-3 w-full sm:w-auto">
                <div class="relative flex-grow sm:flex-grow-0">
                    <i data-lucide="calendar" class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate"></i>
                    <input type="date" class="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary shadow-sm" value="2026-08-01">
                </div>
                <div class="relative flex-grow sm:flex-grow-0">
                    <i data-lucide="calendar" class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate"></i>
                    <input type="date" class="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary shadow-sm" value="2026-08-21">
                </div>
                <button class="btn bg-white border border-border p-2 rounded-lg text-slate hover:text-primary shadow-sm">
                    <i data-lucide="filter" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
        
        <div class="card overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr class="bg-gray-50 border-b border-border text-xs uppercase tracking-wider text-slate font-semibold">
                            <th class="py-4 px-6">Date</th>
                            <th class="py-4 px-6">Employee</th>
                            <th class="py-4 px-6">Check In</th>
                            <th class="py-4 px-6">Check Out</th>
                            <th class="py-4 px-6">Total Hours</th>
                            <th class="py-4 px-6">Extra Hours</th>
                            <th class="py-4 px-6">Status</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-border">
                        ${db.attendance.map((record, i) => `
                        <tr class="hover:bg-indigo-50/30 transition-colors" style="animation: slideUp 0.3s ease-out ${i*50}ms forwards; opacity: 0;">
                            <td class="py-4 px-6 font-medium text-navy whitespace-nowrap">${record.date}</td>
                            <td class="py-4 px-6 font-medium text-navy">${db.users.find(u=>u.id === record.userId)?.name || 'Unknown'}</td>
                            <td class="py-4 px-6 text-slate">${record.checkIn}</td>
                            <td class="py-4 px-6 text-slate">${record.checkOut}</td>
                            <td class="py-4 px-6 font-medium text-navy">${record.totalHours}</td>
                            <td class="py-4 px-6 ${record.extraHours.startsWith('-') ? 'text-error' : 'text-success font-medium'}">${record.extraHours}</td>
                            <td class="py-4 px-6">
                                <span class="px-2.5 py-1 bg-green-100 text-success rounded-full text-xs font-semibold tracking-wide">${record.status}</span>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-border bg-gray-50 flex justify-between items-center text-sm">
                <p class="text-slate">Showing <span class="font-medium text-navy">${db.attendance.length}</span> entries</p>
                <div class="flex space-x-1">
                    <button class="px-3 py-1 border border-border rounded text-slate hover:bg-gray-100 disabled:opacity-50" disabled>Prev</button>
                    <button class="px-3 py-1 bg-primary text-white rounded font-medium">1</button>
                    <button class="px-3 py-1 border border-border rounded text-slate hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    </div>`;
}

function LeaveView() {
    const isAdmin = db.currentUser.role === 'Admin';
    
    return `
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-navy">Time-Off Management</h2>
            ${!isAdmin ? `<button class="btn bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center">
                <i data-lucide="plus" class="w-4 h-4 mr-2"></i> Request Leave
            </button>` : ''}
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            ${!isAdmin ? `
            <div class="lg:col-span-1">
                <div class="card p-6 mb-6">
                    <h3 class="text-lg font-bold text-navy mb-4 border-b border-border pb-2">Leave Balances</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-slate font-medium">Annual Leave</span>
                                <span class="text-navy font-bold">12 / 20 days</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 60%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-slate font-medium">Sick Leave</span>
                                <span class="text-navy font-bold">4 / 10 days</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-secondary h-2 rounded-full" style="width: 40%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Mini Calendar Mockup -->
                <div class="card p-6 hidden md:block">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-navy">August 2026</h3>
                        <div class="flex space-x-1">
                            <i data-lucide="chevron-left" class="w-4 h-4 text-slate cursor-pointer hover:text-primary"></i>
                            <i data-lucide="chevron-right" class="w-4 h-4 text-slate cursor-pointer hover:text-primary"></i>
                        </div>
                    </div>
                    <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate font-medium">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div class="grid grid-cols-7 gap-1 text-center text-sm">
                        <div class="text-gray-300 py-1.5">26</div><div class="text-gray-300 py-1.5">27</div><div class="text-gray-300 py-1.5">28</div><div class="text-gray-300 py-1.5">29</div><div class="text-gray-300 py-1.5">30</div><div class="text-gray-300 py-1.5">31</div><div class="py-1.5">1</div>
                        <div class="py-1.5">2</div><div class="py-1.5">3</div><div class="py-1.5">4</div><div class="py-1.5">5</div><div class="py-1.5">6</div><div class="py-1.5">7</div><div class="py-1.5">8</div>
                        <div class="py-1.5">9</div><div class="py-1.5">10</div><div class="py-1.5">11</div><div class="py-1.5">12</div><div class="py-1.5">13</div><div class="py-1.5">14</div><div class="py-1.5">15</div>
                        <div class="py-1.5">16</div><div class="py-1.5">17</div><div class="py-1.5">18</div><div class="py-1.5">19</div><div class="py-1.5">20</div><div class="py-1.5 bg-primary text-white rounded-md font-bold shadow-sm">21</div><div class="py-1.5">22</div>
                        <div class="py-1.5">23</div><div class="py-1.5">24</div><div class="py-1.5">25</div><div class="py-1.5">26</div><div class="py-1.5">27</div><div class="py-1.5">28</div><div class="py-1.5">29</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="${isAdmin ? 'lg:col-span-3' : 'lg:col-span-2'}">
                <div class="card overflow-hidden shadow-sm h-full flex flex-col">
                    <div class="px-6 py-4 border-b border-border flex justify-between items-center bg-gray-50">
                        <h3 class="text-lg font-bold text-navy">Leave Requests</h3>
                        <div class="flex space-x-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-slate cursor-pointer hover:bg-gray-200">All</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-warning cursor-pointer hover:bg-yellow-200">Pending</span>
                        </div>
                    </div>
                    <div class="overflow-x-auto flex-grow">
                        <table class="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr class="border-b border-border text-xs uppercase tracking-wider text-slate font-semibold bg-white">
                                    <th class="py-3 px-6">Employee</th>
                                    <th class="py-3 px-6">Leave Type</th>
                                    <th class="py-3 px-6">Duration</th>
                                    <th class="py-3 px-6">Status</th>
                                    ${isAdmin ? '<th class="py-3 px-6 text-right">Actions</th>' : ''}
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-border">
                                ${db.leaveRequests.filter(r => isAdmin || r.userId === db.currentUser.id).map((req, i) => `
                                <tr class="hover:bg-gray-50 transition-colors" style="animation: slideUp 0.3s ease-out ${i*50}ms forwards; opacity: 0;">
                                    <td class="py-4 px-6 font-medium text-navy flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-indigo-100 text-primary flex items-center justify-center mr-3 font-bold text-xs">
                                            ${req.name.charAt(0)}
                                        </div>
                                        ${req.name}
                                    </td>
                                    <td class="py-4 px-6 text-slate">${req.type}</td>
                                    <td class="py-4 px-6 text-navy">${req.duration}</td>
                                    <td class="py-4 px-6">
                                        <span class="px-2.5 py-1 ${req.status === 'Pending' ? 'bg-yellow-100 text-warning' : req.status === 'Approved' ? 'bg-green-100 text-success' : 'bg-red-100 text-error'} rounded-full text-xs font-semibold tracking-wide shadow-sm flex items-center w-max">
                                            ${req.status === 'Pending' ? '<span class="w-1.5 h-1.5 rounded-full bg-warning mr-1.5 animate-pulse"></span>' : ''}
                                            ${req.status}
                                        </span>
                                    </td>
                                    ${isAdmin ? `
                                    <td class="py-4 px-6 text-right">
                                        ${req.status === 'Pending' ? `
                                        <div class="flex justify-end space-x-2">
                                            <button class="btn bg-green-50 text-success hover:bg-success hover:text-white p-1.5 rounded-md transition-colors border border-green-200" title="Approve">
                                                <i data-lucide="check" class="w-4 h-4"></i>
                                            </button>
                                            <button class="btn bg-red-50 text-error hover:bg-error hover:text-white p-1.5 rounded-md transition-colors border border-red-200" title="Reject">
                                                <i data-lucide="x" class="w-4 h-4"></i>
                                            </button>
                                        </div>` : '<span class="text-xs text-slate italic">Actioned</span>'}
                                    </td>` : ''}
                                </tr>
                                `).join('')}
                                ${db.leaveRequests.filter(r => isAdmin || r.userId === db.currentUser.id).length === 0 ? `
                                <tr>
                                    <td colspan="5" class="py-8 text-center text-slate">No leave requests found.</td>
                                </tr>
                                ` : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Event Listeners
function attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const pass = document.getElementById('password').value;
            const user = db.users.find(u => (u.email === email || u.id === email) && u.password === pass);
            if (user) {
                db.currentUser = user;
                window.location.hash = '#dashboard';
            } else {
                alert('Invalid credentials');
            }
        });
        
        // Quick login handlers
        document.getElementById('quickAdmin')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('email').value = 'admin@dayflow.com';
            document.getElementById('password').value = 'password123';
        });
        document.getElementById('quickEmp')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('email').value = 'alice@dayflow.com';
            document.getElementById('password').value = 'password123';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const role = document.getElementById('regRole').value;
            const pass = document.getElementById('regPassword').value;
            
            const newId = generateId('Dayflow', name, new Date().getFullYear(), db.users.length + 1);
            
            const newUser = {
                id: newId,
                name,
                email,
                role,
                password: pass,
                baseSalary: role === 'Admin' ? 80000 : 50000,
                status: 'present'
            };
            
            db.users.push(newUser);
            db.currentUser = newUser;
            window.location.hash = '#dashboard';
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            db.currentUser = null;
            db.checkInState = null;
            window.location.hash = '#login';
        });
    }

    const systrayActionBtn = document.getElementById('systrayActionBtn');
    if (systrayActionBtn) {
        systrayActionBtn.addEventListener('click', () => {
            if (db.checkInState === 'checked-in') {
                db.checkInState = null;
            } else {
                db.checkInState = 'checked-in';
            }
            render(); // re-render to update UI
        });
    }
    
    // Update live time
    const systrayTime = document.getElementById('systrayTime');
    if (systrayTime) {
        const updateTime = () => {
            const now = new Date();
            systrayTime.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        };
        updateTime();
        // Since we re-render often, a simple interval might leak, but for MVP it's okay.
        setInterval(updateTime, 60000);
    }
}

// Initial render
window.addEventListener('DOMContentLoaded', () => {
    currentRoute = window.location.hash || '#login';
    render();
});
