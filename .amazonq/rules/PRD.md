# System Specification & Architecture Blueprint: Brookfield Properties Platform

**Document Type:** AI-Ingestible Product Requirements Document (PRD)  
**Source Document Version:** v1.3 FINAL System Context  
**Date:** June 14, 2026

## 1. Executive Summary & Core System Logic

### 1.1 Platform Nature
Brookfield Properties operates as a closed, referral-only property review task platform utilizing a standalone, internal virtual currency engine. The platform is structurally divided into an unauthenticated public interface, an authenticated client application, and a centralized management back-office interface.

### 1.2 The System Lifecycle Flow

**Onboarding Constraint:** The system is completely closed to the public. Registration strictly requires a valid, pre-existing invitation reference key.

**Capitalization Flow:** Users submit deposit requests via an external network channel. This creates a ledger entry that stays in a Pending state until a platform administrator manually verifies the capital arrival and updates the record to Approved. This administrative approval systematically credits the user's wallet balance.

**The 3-Order Assignment Rule:** The core task cycle relies on manual administrative pairing. An administrator must navigate to the back-office tools and manually assign exactly three (3) distinct real estate entries from the global properties catalog to a specific target user account.

**Task Execution Canvas ("Generate Lots"):** The user navigates to the /data-optimization interface and triggers the task execution engine via a centralized button click. This operation issues a structured state mutator call that picks an active order from the user's three pre-assigned properties. This action immediately increments the user's current session quota metrics, calculates a micro-commission based on the property value and tier multiplier, and instantly posts the payout to the user's balance.

**Realization Gateway (Redemption):** Users request a payout of their accumulated earnings to an external wallet address. Payout requests are evaluated against per-user custom thresholds (min_withdrawal / max_withdrawal) and require verification of a secondary transaction-specific credential called the Wallet Password. Once verified, requests sit in an administrative review queue pending execution or rejection.

### 1.3 Key Architectural Core Rules

**Currency Isolation:** Every accounting, transaction, pricing, and visualization metric across all screens must be denominated in VIEWS. No dynamic third-party conversion layers are permitted inside the core database layer. The visual layout string format must strictly follow the VIEWS [amount] pattern, ensuring trailing float parameters are preserved (e.g., VIEWS 66.00, VIEWS 0.33).

**Ledger Inversion (Negative Balances):** The core balance datastore column can scale below zero into negative numbers. This occurs via an explicit admin interface operation called Add Debit, which manually logs an absolute deduction entry against the wallet ledger.

**Decoupled Security Toggles:** An account's global login status (user_status) is entirely decoupled from its financial clearance status (wallet_status). An administrator can independently set wallet_status to Deactivate to lock withdrawal subroutines while keeping the primary account Active, allowing the user to seamlessly navigate the client core task app without disruptions.

## 2. Currency, Tier Economics & Earning Model

### 2.1 The Earning Engine Formula
Every task optimization cycle processes a calculation utilizing the property's static baseline valuation and the user's active tier multiplier:

**Commission Earned = Property Task Value (Price) × Membership Commission Rate**

- **Execution Scenario A:** Property Value = VIEWS 66.00; Multiplier = 0.50%. Payout = VIEWS 0.33.
- **Execution Scenario B:** Property Value = VIEWS 110.00; Multiplier = 0.50%. Payout = VIEWS 0.55.

### 2.2 System Membership Limits (Data-Driven Engine)
The membership layer is structured as a fully dynamic matrix governed by administrative configurations. The platform defaults to a single seed tier configuration:

| Tier ID | Level Display Name | Daily Order Limit | Commission Rate | System Permissions |
|---------|-------------------|-------------------|-----------------|-------------------|
| 1 | Silver | 35 Tasks / Day | 0.50% | Full Data-Driven CRUD |

The system must support additional tier runtime configurations (e.g., Gold, Platinum) with custom limits and percentage multipliers created via the back-office control center.

## 3. Global System Page Inventory & Route Gating

### 3.1 Client-Facing Applications

- `/` — Landing Interface (Theme: Video Background + Teal Text)
- `/user-login` — Authentication Portal (Theme: Video Background + Teal Controls)
- `/user-register` — Registration Interface (Theme: Video Background + Teal Controls)
- `/dashboard` — Application Hub (Theme: Teal Hero + Base White Content Grid)
- `/data-optimization` — Task Canvas ("Generate Lots") (Theme: Solid White Navbar + Pure Black Body Canvas)
- `/profile` — Account Management Center (Theme: White Background + Teal Accent Header Elements)
- `/history` — Task Records Log Archive (Theme: Inverted Minimal Navbar Layout)
- `/recharge-history` — User Deposit Audit Ledger (Theme: Teal Hero + Grid Table Layout)
- `/redemption` — Withdrawal Gateway Panel (Theme: White Canvas + Teal Outlined Input Matrices)
- `/redemption-history` — User Withdrawal Audit Ledger (Theme: Teal Hero + Grid Table Layout)
- `/support` — Customer Service Interface (Theme: Teal Hero Header + Full Content Container)
- `/wallet` — User Wallet Balance Tracker (Theme: Operational Layout Context)
- `/bind-wallet` — External Address Link Portal (Theme: Crypto Verification Layout)
- `/lots-optimization` — Tier Progression Portal (Theme: Upgrade Path Matrix Layout)

### 3.2 Back-Office Management Suite

- `/administration?page=N` — Global Members Master Grid
- `/reset-orders/:id` — Configured User Setup Orders Log
- `/reset-single/:id` — Task Allocation Control Center
- `/update-user/:id` — Member Attribute Modifier Form
- `/order-list` — Master Property Product Catalog Matrix
- `/memberships` — Membership Tier Configuration Engine
- `/add-member` — Manual Registration Form Engine

## 4. Granular Page Engineering Specifications — Client Application

### 4.1 Unauthenticated Gateways

#### 4.1.1 Landing Interface (/)
- **Aesthetic Frame:** Full viewport layout utilizing an autoplaying, muted, looping video layer.
- **Brand Anchoring:** Renders the primary corporate logo (BROOKFIELD PROPERTIES) stylized in flat white at the top-left margin.
- **Hero Message Typography:** Displays a large title reading "Building Your Future", supported by a secondary copy container detailing corporate real estate operations.
- **Primary Action Path:** A centered, high-contrast call-to-action button containing the label "Sign In to Account", routing explicitly to /user-login.
- **Interaction Subsystem:** A floating teal messaging hub icon anchored persistently at the bottom-right viewport boundary.

#### 4.1.2 Authentication Portal (/user-login)
- **Layout Continuity:** Inherits the absolute full-screen video background layer.
- **Input Scope:** Contains standard text fields capturing Username and Password inputs.
- **Session Management:** Provides a "Remember Me" input checkbox flanked by a decoupled anchor linking to forgotten credential restoration flows.
- **Submission Vectors:** Features a primary submit block reading "Sign In", alongside an alternate navigation anchor pointing directly to the /user-register flow.

#### 4.1.3 Registration Interface (/user-register)
- **Aesthetic Frame:** Preserves the video background template layer.
- **Validation Payload:** Form processing requires exactly 8 distinct input channels:
  - Username
  - Full Name
  - Email Address
  - Phone Number
  - Login Password
  - Confirm Login Password
  - Wallet Password (A separate security credential reserved for financial clearance operations)
  - Reference Code (The mandatory onboarding link key required to clear registration filters)

### 4.2 Application Hub (/dashboard)

**Header Navigation Architecture:** High-density teal canvas backdrop with contrast-white typography. Displays corporate logotype branding aligned left, grouping navigation links to /dashboard, /data-optimization, /history, /profile, and /wallet. The rightmost boundary hosts an outlined, white-bordered interface routing element for live support queues.

**Hero Unit:** A full-width display banner powered by a gradient shifting from dark teal to a light mint hue. Renders a personalized greeting ("Welcome, [username]!") layered over a heavily styled uppercase action button tracking extended character spacing: GENERATE LOTS, routing directly to /data-optimization.

**Quick Access Grid Array:** A horizontal list containing 8 rounded navigation tiles. Each element encapsulates a flat color icon asset paired with a crisp teal label below it:
- Profile → Lots Optimization → History → Bind Wallet → Recharge History → Redemption → Redemption History → Support

**Services Framework Component:** A two-column information section. The left column outputs structural text anchored by an outlined button reading "OUR SERVICES". The right side loads a 4-card grid mapping core capabilities: Property Sales & Leasing, Property Management, Investment Advisory, and Tenant Representation.

**Team Showcase Block:** Features a title container reading "Our Team", generating 4 uniform profile modules mapping the product delivery team:
- Fletch Skinner (Product Strategist)
- Lance Bogrol (Visual Designer)
- Valent Morose (Android Developer)
- Giles Posture (iOS Developer)

Each module requires a circular image, name text, specialized corporate role designation, bio description paragraph, and social redirection paths.

**Metric Counter Ribbon:** A mid-page teal gradient accent banner outputting four static operational summary elements:
- 126 Mobile App Complete | 98 Happy Customer | 176 App Version | 16 Award Win

**Corporate Editorial Log (Blog Section):** Displays a 3-card grid highlighting company updates. Cards display post image assets topped with a flat date badge reading "APR 09":
- Title 1: "5 steps to becoming GDPR compliant on mobile apps"
- Title 2: "Measuring app success through mobile analytics"
- Title 3: "How accessibility will influence your app dev"

**Footer Structure:** Flat teal background containing white typography. Emits the corporate logotype, a secondary navigation tree split into helpful links and account profiles, and an explicit physical location label matching 455 West Orchard Street.

### 4.3 Task Execution Canvas (/data-optimization)

**Layout Style Inversion:** To highlight the focus on task processing, the theme switches to a dark aesthetic. The page canvas uses a pure black background combined with a deep green top gradient wrapper (#1A2E1A to #000000). To maintain strong visual separation, the top navbar is rendered in solid white text over a crisp white backdrop, featuring a contact action route button highlighted in solid green (#16A34A).

**Real-Time Context Status Blocks:** Houses a 4-card operational monitor grid utilizing rounded corners (border-radius: 16px) and dark gray backdrops (#1C1C1E):
- **Account Balance:** Outputs a gray circle coin graphic mapping the user's active wallet balance prepended by currency text indicators (e.g., $210.49 (VIEWS)).
- **Today's Earnings:** Emits a teal chart trend asset displaying current daily earnings.
- **Orders Today:** Tracks daily completed tasks via a bold checkbox layout.
- **Total Orders:** Uses a list graphic tracking global lifetime completed tasks.

**The Execution Core Trigger:** A centered, full-width royal blue (#2563EB) pill button containing a settings gear graphic (⚙️) on the left. The button label reads exactly: "Generate Lots". Clicking this button issues an authenticated asynchronous POST to /api/lots/generate.

### 4.4 Account Management View (/profile)

**User Identity Banner:** Features a centralized layout holding a gray circular user avatar asset. Emits the username in bold primary teal, directly stacked over a blue pill indicator badge outputting the tier level (e.g., "Silver"). The upper right margin provides direct action links for copying invitation keys and executing system exits.

**Wallet Summary Cards:** A horizontal two-column display row outputting Account Balance on the left and a detailed Today's Earnings component paired with a trend vector on the right.

**Credibility Quality Component:** A full-width metric container containing a text label reading "Credibility", with a percentage right-aligned to match the user's trust score. It features a flat green progress tracking fill bar that dynamically handles scaling configurations based on backend field parameters.

**Grid Navigation Template:** Replicates a 2-row by 4-column layout mapping clean, white rounded card modules pointing to the app's internal navigation targets.

**Secondary Exit Button:** A large, full-width blue (#2563EB) button anchored at the bottom edge containing an exit arrow graphic paired with the clear label "Logout".

### 4.5 Task Records Log Archive (/history)

**Minimal Navbar Layout:** Removes standard navigational headers. The bar renders only the textual corporate logo on the left and a circular profile avatar on the right.

**Query Filtering Array:** Features a 4-state navigation sub-tab system mapping filter flags:
- All → Pending → Completed → Undone

Active selections trigger a crisp blue underline accent, while inactive filters remain muted gray.

**Task Ledger Rows:** Tasks are rendered in white, full-width horizontal rows. The layout template maps exactly six key data blocks:
- **Timeline Ingestion:** Creation timestamp string explicitly following the YYYY-MM-DD format.
- **Media Reference:** An 80x80px image container loading the assigned property's thumbnail asset.
- **Property Identity:** Bold property title string.
- **Quality Context:** A 5-star yellow icon display row mapping product rating layers.
- **Accounting Fields:** A dual columns stack outputting Total Amount and calculated Commission variables styled in clear teal text.
- **State Indicators:** A right-aligned status badge pill tracking the task state (Green = Completed, Yellow = Pending, Red = Undone).

### 4.6 Financial Triggers & Logs (/recharge-history, /redemption, /redemption-history)

**Deposit History Interface:** A clean tabular data ledger outputting row indexes, deposit dates (YYYY-MM-DD), and the exact recharge amount. If no data is returned, it renders a centered empty state notification. Below the grid, a blue action button provides a shortcut route back to the platform's deposit request flow.

**Withdrawal Request Console (/redemption):** Displays a large teal header block showing the user's cashout balance. Below, a quick-select amount grid provides 6 fixed-value button targets:

| 100 | 150 | 200 |
|-----|-----|-----|
| 1000 | 1500 | 2000 |

An adjacent custom text input allows precise override values, paired with a high-visibility "All" button that instantly populates the input field with the account's total withdrawable balance. The form requires entering the specialized security token (Redemption Password / Wallet Password) inside a masked entry field before firing submission actions.

## 5. Management Administration Suite Framework

### 5.1 Global Structural Paradigm

**Navigation Rail Architecture:** A fixed left sidebar styled in a near-black green-gray tone (#1A1F1A). The top section features a vibrant orange corporate icon (P), positioned above a profile status widget for the authenticated admin session and an integrated system-wide search input.

**Data Layout Engine:** Data tables use alternating light-gray row backgrounds (#F9FAFB) for readability. They feature integrated DataTables toolbars that support real-time searching and provide clean data extraction shortcuts (Copy, CSV, Excel, PDF, Print, and Column Visibility controls).

### 5.2 Global Members Matrix Dashboard (/administration?page=N)

The primary system monitor interface. It uses a highly technical, paginated data grid that tracks user operations across 16 explicit database data columns:

| Column Header | Internal Datastore Field Mapping | Functional Application Context |
|--------------|----------------------------------|-------------------------------|
| ID | INT (Primary Key) | Unique system record auto-increment identifier. |
| Username | VARCHAR (Unique String) | Authenticated identity credential string. |
| P-ID | INT (Foreign Key Nullable) | Maps the database row ID of the immediate upstream referrer user. |
| Phone | VARCHAR | Contact phone sequence string. |
| Balance | DECIMAL(12,2) | Current spendable VIEWS ledger index. Supports negative values. |
| Available | INT | Calculated remaining quota counter extracted from tier data. |
| Total Orders | INT | Running cumulative counter tracking lifetime tasks generated. |
| Reward | DECIMAL(12,2) | Cumulative historical sum of all commissions awarded. |
| % | TINYINT | Trust modifier mapping account Credibility (0–100). |
| PID Name | VARCHAR | Resolves the plain-text handle of the upstream parent account. |
| Referral Code | VARCHAR (Unique Key) | The account's shareable programmatic onboarding invite link key. |
| Membership | ENUM / FOREIGN KEY | Renders the tier level badge string (e.g., blue pill for Silver). |
| Status | ENUM('Active','Deactivate') | Account login permission toggle (Green = Active, Red = Disabled). |
| W Status | ENUM('Active','Deactivate') | Isolated financial withdrawal permission toggle (Red = Deactive). |
| Registration Time | TIMESTAMP | Persistent timestamp log recording account creation. |
| Last Login | TIMESTAMP (Nullable) | Running audit log recording the most recent session access time. |

**Row Action Grid Layout:** Every entry row handles a compact, two-row button matrix cluster containing 5 dynamic system operators:

**Row 1 Operators:**
- **[Setup Order]** (Blue Button #2563EB): Links to /reset-orders/:id to audit assigned user tasks.
- **[Add Debit]** (Red Button #DC2626): Renders a modal interface to post an immediate deduction entry against the user's balance.

**Row 2 Operators:**
- **[Reset Orders]** (Orange Button #F59E0B): Links to /reset-single/:id to modify paired task configurations.
- **[More Actions]** (Teal Split Dropdown): Opens a detailed contextual options panel linking to: Edit Profile, Wallet Details, Deposit Request History, and Withdrawal Request History.

### 5.3 Task Allocation Control Center (/reset-single/:id)

**Core Allocation Rule:** System parameters enforce an absolute matching requirement. The administrator must select exactly three properties via checkbox filters to establish a valid runtime cycle for a user.

**Sequence Gating Engine:** Contains a high-priority system input field titled After Order Number: (sequence_after_order_no).

**Algorithmic Logic:** The assigned property trio remains completely locked from client app generation calls until the user's historical Total Orders integer successfully scales past this sequence boundary parameter.

## 6. System Architecture Relational Database Schema Blueprint

```
                     +-------------------+
                     | membership_levels |
                     +-------------------+
                               | 1
                               |
                               | 1..*
+-----------------+  |   +-------------+  1     1..* +--------------------+
|    recharges    |--+---|    users    |--------------|  user_tasks_queue  |
+-----------------+ * 1 +-------------+              +--------------------+
                               | 1     1                       * |
                               |                                 |
                               | 1                             1 |
                        +--------------+              +--------------------+
                        |   wallets    |              |     properties     |
                        +--------------+              +--------------------+
                               | 1                             
                               |                               
                               | 1                             
                        +--------------+               +--------------------+
                        | bound_wallets|               |     debits_log     |
                        +--------------+               +--------------------+
```

The database design relies on strict Referential Integrity constraints. The database structure is defined by the following schema specification:

```sql
-- Schema Verification Blueprint
-- Target: MySQL / MariaDB Engine Compliance

-- 1. MEMBERSHIP CONFIGURATION ENGINE
CREATE TABLE membership_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    order_limit INT NOT NULL DEFAULT 35,
    commission_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. MASTER USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_password_hash VARCHAR(255) NOT NULL,
    reference_code VARCHAR(20) NOT NULL UNIQUE,
    referrer_id INT NULL,
    tier_id INT NOT NULL DEFAULT 1,
    credibility TINYINT NOT NULL DEFAULT 100,
    min_withdrawal DECIMAL(10,2) DEFAULT 50.00,
    max_withdrawal DECIMAL(10,2) DEFAULT 500.00,
    user_status ENUM('Active', 'Deactivate') DEFAULT 'Active',
    wallet_status ENUM('Active', 'Deactivate') DEFAULT 'Deactivate',
    user_type ENUM('User', 'Admin') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (tier_id) REFERENCES membership_levels(id)
);

-- 3. FINANCIAL ACCOUNTING BALANCING LEDGER
CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_recharged DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_earned DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_withdrawn DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. MASTER PROPERTY CATALOG
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. PAIRED TASK ALLOCATION MANAGER
CREATE TABLE user_tasks_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    task_value DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Completed', 'Undone') DEFAULT 'Pending',
    sequence_after_order_no INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- 6. AUDIT TRAILS AND SYSTEM RECORDS
CREATE TABLE recharges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE redemptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    wallet_address VARCHAR(200) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE debits_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(255) NULL,
    applied_by_admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (applied_by_admin_id) REFERENCES users(id)
);
```

## 7. Functional Endpoint Matrix

### 7.1 Client Application Interfaces

**POST /api/auth/register (Public Authorization Block)**
- **Payload:** username, full_name, email, phone, password, wallet_password, reference_code
- **Logic:** Verifies data format and unique field parameters. Confirms the input reference_code matches an active entry within users.reference_code. Sets up the relational graph and initializes the sub-entities (wallets data row with 0.00 balances).

**POST /api/auth/login (Public Authorization Block)**
- **Payload:** username, password
- **Response:** Returns a secure authorization token alongside context profile arrays. Asynchronously updates the account's last_login_at timestamp field.

**POST /api/lots/generate (JWT Protected Session Core)**

Process Flow:
1. Queries the target account's profile row within users and applies a row-level database lock (SELECT FOR UPDATE) to block concurrent race conditions.
2. Validates that user_status == 'Active'.
3. Aggregates today's completed items from user_tasks_queue to ensure the session count stays strictly below the user's tier restriction ceiling (order_limit).
4. Queries the user_tasks_queue to pull properties assigned to the user that match status == 'Pending' and satisfy the sequence barrier rule (users.total_orders > sequence_after_order_no).
5. Extracts the top property record's base value and calculates the target commission.
6. Processes an atomic ledger update against the wallets model: increments balance and total_earned by the computed micro-commission.
7. Updates the processed task item status parameter directly to Completed.
8. Commits all record transactions cleanly and returns a success payload confirmation.

### 7.2 Administrative Back-Office Gateways

All endpoints listed below must run through authorization middleware filters that strictly enforce administrative role checks (user_type == 'Admin').

**GET /api/admin/users?page=X** — Returns a paginated dataset tracking all system profiles mapped across the complete 16-attribute specification.

**PUT /api/admin/users/:id** — Standardizes full profile attribute modifications over target parameters, specifically handling custom operational limits (min_withdrawal, max_withdrawal), trust metrics (credibility), or individual account lockouts (user_status, wallet_status).

**POST /api/admin/users/:id/debit** — Manual debit system. Captures input variables for adjustments (amount, reason) and applies them directly as balance deductions against the target wallet record. This method writes a tracking row into the system audit tables (debits_log).

**POST /api/admin/users/:id/orders/assign** — Handles manual task pairing workflows. Requires an input payload containing exactly three property record IDs alongside a sequence boundary parameter:

```json
{ 
  "property_ids": [12, 45, 78], 
  "sequence_after_order_no": 35 
}
```

This action clears out any unexecuted tasks and inserts three clean entries into the user's task queue table.

## 8. Implementation Integrity Directives

To guarantee systemic alignment during automated code generation runs, execution logic must adhere strictly to these engineering parameters:

**Precision Arithmetic Enforcement:** All financial balancing metrics, property prices, and transaction histories must rely on high-precision fixed-decimal datastores (DECIMAL(12,2)). Floating-point data calculations are completely prohibited inside the core processing engines.

**Transactional Boundary Safety:** Wrap all task processing subroutines called by the /api/lots/generate endpoint inside strict database transaction blocks to fully prevent multi-session data exploitation vulnerabilities.

**Automated Quota Resets:** Implement an automated, high-priority background cron job set to execute precisely at 00:00:00 UTC each day. This routine must reset all daily performance counters and user-level tracking metrics to clean baselines across the system.
