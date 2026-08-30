# Thịnh Phát Hair Clip Store - Frontend

Modern, elegant, and responsive e-commerce showcase website for **Thịnh Phát** - a Vietnamese hair accessories store.

## 📋 Project Overview

**THỊNH PHÁT** specializes in high-quality hair clips and accessories. This website is designed to:

- ✨ Showcase hair clip products elegantly
- 📂 Organize products by categories
- 📸 Display detailed product information with images
- 💬 Enable direct customer communication via Zalo
- 🎯 Provide a simple, fast, and focused shopping experience

### Customer Journey

```
Trang chủ → Khám phá sản phẩm → Xem chi tiết → Nhắn Zalo → Chốt số lượng với shop
```

## 🛠️ Tech Stack

- **Framework**: React 19 + TanStack Start
- **Routing**: TanStack Router v1
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form
- **Language**: TypeScript
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # Radix UI component wrappers
│   ├── CategoryCard.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── routes/             # TanStack Router pages
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   ├── san-pham.index.tsx
│   ├── san-pham.$slug.tsx
│   ├── danh-muc.tsx
│   ├── gioi-thieu.tsx
│   └── lien-he.tsx
├── services/           # Business logic
│   └── catalog.ts
├── data/               # Mock data (static)
│   ├── products.ts
│   └── categories.ts
├── types/              # TypeScript types
│   └── index.ts
├── lib/                # Utilities & helpers
│   ├── utils.ts
│   ├── site.ts
│   └── error-page.ts
└── styles.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (v20+ recommended)
- pnpm, npm, or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/hair-clip-store-fe.git
cd hair-clip-store-fe
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Setup environment**

```bash
cp .env.example .env.local
```

4. **Start development server**

```bash
pnpm dev
# or
npm run dev
```

The site will be available at `http://localhost:5173`

## 📝 Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Build development version
pnpm build:dev

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Format code with Prettier
pnpm format
```

## 🎨 Design Features

- Responsive design (mobile-first approach)
- Accessible UI components (Radix UI)
- Beautiful animations and transitions
- Vietnamese localization
- Dark/Light mode ready (Tailwind CSS)
- Floating Zalo contact button

## 🔧 Configuration

### TypeScript

Configuration in `tsconfig.json`:

- **Target**: ES2022
- **Module Resolution**: Bundler
- **Strict Mode**: Enabled
- **Path Alias**: `@/*` → `./src/*`

### Prettier

Code formatting configured in `.prettierrc.json`:

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

### ESLint

Linting rules configured in `eslint.config.js`:

- Recommended ESLint rules
- TypeScript ESLint recommendations
- React Hooks plugin
- React Refresh plugin
- Prettier integration

## 📦 Key Dependencies

### UI & Styling

- `@radix-ui/*` - Accessible UI components
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variants
- `lucide-react` - Beautiful icons

### Data & State

- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form state management
- `zod` - Schema validation

### Utilities

- `clsx` - Conditional class names
- `tailwind-merge` - Merge Tailwind classes
- `date-fns` - Date utilities
- `sonner` - Toast notifications

## 🚨 Quality Assurance

### Linting

Ensure all code passes linting rules:

```bash
pnpm lint
```

### Code Formatting

Keep consistent code style:

```bash
pnpm format
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security

- No authentication/login system
- No payment processing
- No user data collection beyond basic contact
- All data is static/mock data

## 📞 Contact & Support

For shop inquiries and orders, customers should contact via:

- **Zalo**: [Shop Zalo number on website]
- **Facebook**: [Shop Facebook page]

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This project is connected to Lovable. When pushing to the connected branch:

- Avoid force pushing or rebasing published commits
- Keep the branch in a working state
- Commits sync back to Lovable

---

**Built with ❤️ for Thịnh Phát Hair Clip Store**

The customer-facing website should primarily use:

Vietnamese

All navigation labels, buttons, descriptions, headings, and product information should use natural Vietnamese.

Avoid placeholder English text in the final UI.

DESIGN DIRECTION

Create a UI that feels:

Modern

Minimal

Elegant

Clean

Friendly

Trustworthy

Premium but affordable

Suitable for a Vietnamese hair accessories store

The website should NOT look like a generic marketplace or Shopee clone.

It should feel like a modern boutique product catalog.

Prioritize:

Product Images → Product Discovery → Product Information → Contact via Zalo

COLOR PALETTE

Use a simple and elegant color system.

Main colors:

Background: White or warm off-white

Secondary background: Soft cream / light beige

Primary text: Dark charcoal or deep brown

Secondary text: Neutral gray

Accent color: Soft dusty pink, muted rose, or elegant warm brown

Suggested feeling:

White + Cream + Beige + Dark Brown + Soft Pink Accent

Do not use too many colors.

Avoid bright gradients and overly colorful UI.

Use subtle borders, soft shadows, and plenty of whitespace.

TYPOGRAPHY

Use modern, clean typography with strong hierarchy.

The brand name THỊNH PHÁT should feel recognizable and elegant.

Use:

Large bold headings

Clean readable body text

Clear spacing between sections

Comfortable line height

The design should feel polished and professional.

WEBSITE STRUCTURE

Create the following main pages:

Trang chủ

Sản phẩm

Chi tiết sản phẩm

Danh mục sản phẩm

Giới thiệu

Liên hệ

1. NAVIGATION BAR

Create a clean and modern sticky navigation bar.

Left side:

THỊNH PHÁT

Optional small subtitle:

Kẹp Tóc & Phụ Kiện

Navigation links:

Trang chủ

Sản phẩm

Danh mục

Giới thiệu

Liên hệ

Right side:

A prominent CTA button:

Nhắn Zalo

The navigation bar should:

Stay visible when scrolling

Have a subtle background blur or solid background

Be responsive

On mobile:

Use a hamburger menu

Keep the layout simple

Make the Zalo action easily accessible

2. HOME PAGE

Hero Section

Create a beautiful and visually attractive hero section.

The hero should immediately communicate what the store sells.

Use a large lifestyle or product-focused image of hair clips.

Headline:

Khám phá những mẫu kẹp tóc dành cho bạn

Description:

Thịnh Phát mang đến nhiều mẫu kẹp tóc đa dạng với nhiều kiểu dáng, màu sắc và phong cách khác nhau. Dễ dàng khám phá sản phẩm, xem thông tin chi tiết và liên hệ trực tiếp với shop qua Zalo để đặt hàng.

Buttons:

Primary button:

Khám phá sản phẩm

Secondary button:

Nhắn Zalo

The hero should feel elegant, spacious, and modern.

Do not overcrowd the section.

3. FEATURED CATEGORIES

Create a section:

Khám phá theo phong cách

Display visually attractive category cards.

Suggested categories:

Kẹp càng cua

Kẹp nơ

Kẹp bấm

Kẹp tóc tối giản

Mẫu dễ thương

Mẫu nổi bật

Each category card should include:

Category image

Category name

Optional short description

Interactions:

Subtle hover effect

Slight image zoom

Smooth transition

Clicking the card filters or navigates to the related products

Use a clean responsive grid.

4. FEATURED PRODUCTS

Create a section:

Sản phẩm nổi bật

Subtitle:

Khám phá những mẫu kẹp tóc được nhiều khách hàng yêu thích tại Thịnh Phát.

Display product cards.

Each product card should include:

Large product image

Product name

Category

Short description

Price if available

Product code

Button or interaction to view details

Example products:

Kẹp Càng Cua Trơn Basic

Kẹp Tóc Nơ Ngọc Trai

Kẹp Bấm Tối Giản

Kẹp Tóc Hoa Pastel

Kẹp Càng Cua Vân Đá

Kẹp Tóc Nơ Nhung

Kẹp Tóc Hoa Trong Suốt

Kẹp Càng Cua Phong Cách Hàn Quốc

Product card interactions:

Image zoom on hover

Slight elevation

Smooth transition

Entire card can be clickable

Desktop:

4 products per row when space allows.

Tablet:

2–3 products per row.

Mobile:

2 products per row.

Prioritize product images.

5. WHY CHOOSE THỊNH PHÁT

Create a simple benefits section.

Title:

Vì sao chọn Thịnh Phát?

Display 4 simple benefit cards:

Đa dạng mẫu mã

Nhiều kiểu dáng và phong cách để khách hàng dễ dàng lựa chọn.

Dễ dàng xem sản phẩm

Thông tin và hình ảnh sản phẩm được hiển thị rõ ràng.

Liên hệ nhanh qua Zalo

Chỉ cần một thao tác để nhắn tin trực tiếp với shop.

Tư vấn thân thiện

Hỗ trợ khách hàng lựa chọn mẫu sản phẩm phù hợp.

Use simple icons.

Do not make this section too visually heavy.

6. CALL TO ACTION SECTION

Create an elegant CTA section.

Headline:

Bạn đã tìm được mẫu mình yêu thích?

Description:

Nhắn tin trực tiếp cho Thịnh Phát qua Zalo để được tư vấn thêm thông tin và chốt số lượng sản phẩm.

Main CTA:

Chat với Thịnh Phát trên Zalo

Make this section visually attractive but minimal.

7. PRODUCT LISTING PAGE

Create a dedicated page:

Sản phẩm

Subtitle:

Khám phá tất cả các mẫu kẹp tóc và phụ kiện hiện có tại Thịnh Phát.

Features:

Search products

Category filters

Responsive product grid

Filter categories:

Tất cả

Kẹp càng cua

Kẹp nơ

Kẹp bấm

Tối giản

Dễ thương

Mẫu nổi bật

The filter UI should be simple.

Use:

Pills

Tabs

Or clean filter buttons

Avoid complicated sidebar filters.

SEARCH

Add a clean search input.

Placeholder:

Tìm kiếm sản phẩm...

Users should be able to search by:

Product name

Product category

Product code

Keep the interaction fast and simple.

PRODUCT GRID

Display all products in a visually consistent grid.

Each product card should include:

Product image

Product name

Category

Product code

Short description

Optional price

Interaction:

Clicking a product opens the product detail page.

8. PRODUCT DETAIL PAGE

This is one of the most important pages.

Create a premium and clean product detail experience.

Desktop Layout

Use a two-column layout.

Left Side

Product gallery:

Large main image

Multiple image thumbnails

Clicking thumbnails changes the main image

Optional image zoom interaction

Right Side

Display:

Product name

Product category

Product code

Price if available

Product description

Material

Size

Available colors or variations

Product information

Example:

Mã sản phẩm: KC-001

Chất liệu: Nhựa cao cấp

Kích thước: 8cm

Màu sắc: Đen, Nâu, Kem

PRODUCT DETAIL CTA

The most important button should be:

Nhắn Zalo để đặt hàng

Supporting text:

Liên hệ trực tiếp với Thịnh Phát để hỏi thêm thông tin và chốt số lượng sản phẩm.

When clicking this button:

Redirect or open the seller's Zalo contact.

Prepare the architecture so the Zalo phone number or URL can easily be configured later.

For example, use a configuration variable such as:

ZALO_CONTACT_URL

The Zalo message should ideally include:

Xin chào Thịnh Phát, tôi đang quan tâm đến sản phẩm [Product Name] - Mã sản phẩm: [Product Code]. Tôi muốn hỏi thêm thông tin và số lượng.

Also include:

Copy product code button

Share product button

Back to products button

RELATED PRODUCTS

At the bottom of the product detail page, display:

Có thể bạn cũng thích

Show 4 related products based on:

Same category

Similar style

Each card should link to the product detail page.

MOBILE PRODUCT DETAIL EXPERIENCE

The mobile experience is extremely important.

On mobile:

Product images should be large

Product information should be easy to read

Buttons should have large touch targets

Create a sticky bottom CTA:

Nhắn Zalo để đặt hàng

This CTA should remain easily accessible when browsing product information.

9. CATEGORY PAGE

Create a page:

Danh mục sản phẩm

Display all categories with visually attractive image cards.

Example categories:

Kẹp càng cua

Kẹp nơ

Kẹp bấm

Kẹp tóc dễ thương

Kẹp tóc tối giản

Phụ kiện tóc khác

Clicking a category navigates to the filtered product list.

10. ABOUT PAGE

Create a simple and elegant About page.

Title:

Về Thịnh Phát

Content:

Thịnh Phát là nơi giới thiệu và cung cấp nhiều mẫu kẹp tóc và phụ kiện tóc với đa dạng kiểu dáng, màu sắc và phong cách.

Chúng tôi mong muốn giúp khách hàng dễ dàng khám phá và lựa chọn những mẫu sản phẩm phù hợp với sở thích và nhu cầu của mình.

Khách hàng có thể xem trực tiếp các mẫu sản phẩm trên website, tham khảo thông tin chi tiết và liên hệ với Thịnh Phát qua Zalo để được tư vấn và đặt hàng.

Include:

Brand story section

Product images

Simple visual layout

Keep the page clean.

11. CONTACT PAGE

Create a simple contact page.

Title:

Liên hệ với Thịnh Phát

Description:

Bạn cần tư vấn hoặc muốn đặt hàng? Hãy liên hệ trực tiếp với chúng tôi qua Zalo.

Display:

Zalo contact

Phone number placeholder

Optional Facebook or social media links

Main CTA:

Chat với Thịnh Phát trên Zalo

The Zalo contact should be the primary focus.

12. FLOATING ZALO BUTTON

Create a floating Zalo contact button.

Requirements:

Fixed at the bottom-right corner

Visible on every page

Does not block important UI

Clear Zalo branding

Subtle hover or pulse animation

Tooltip:

Nhắn tin với Thịnh Phát

When clicked:

Open the configured Zalo contact link.

13. FOOTER

Create a clean footer.

Include:

THỊNH PHÁT

Kẹp Tóc & Phụ Kiện

Navigation:

Trang chủ

Sản phẩm

Danh mục

Giới thiệu

Liên hệ

Contact:

Zalo

Phone number

Optional social media

Copyright:

© 2026 Thịnh Phát. All rights reserved.

Keep the footer simple and elegant.

UX REQUIREMENTS

The website should have a simple and intuitive user journey.

Main flow:

Step 1

Customer enters the homepage.

Step 2

Customer sees attractive product visuals.

Step 3

Customer explores categories or products.

Step 4

Customer selects a product.

Step 5

Customer views detailed product information and images.

Step 6

Customer clicks:

Nhắn Zalo để đặt hàng

Step 7

Customer contacts Thịnh Phát through Zalo.

Step 8

Customer discusses product quantity and confirms the order directly with the seller.

The UX should minimize unnecessary steps.

RESPONSIVE DESIGN

The website must work beautifully on:

Desktop

Laptop

Tablet

Mobile

Use a mobile-first mindset.

On mobile:

Large touch targets

Simple navigation

2-column product grid

Prominent product images

Easy-to-read product information

Easily accessible Zalo CTA

Sticky action button on product detail pages

Avoid horizontal scrolling.

ANIMATIONS

Use subtle and elegant animations only.

Examples:

Fade-in when sections enter the viewport

Smooth hover effects

Product image zoom

Card elevation

Smooth button interactions

Soft page transitions if appropriate

Do NOT overuse animations.

The experience should feel smooth and premium, not flashy.

COMPONENT ARCHITECTURE

Create reusable components.

Suggested components:

components/

Navbar

MobileMenu

HeroSection

SectionHeader

CategoryCard

CategoryGrid

ProductCard

ProductGrid

ProductFilter

ProductSearch

ProductGallery

ProductInfo

ZaloButton

FloatingZaloButton

CTASection

Footer

EmptyState

LoadingState

Pages:

pages/

HomePage

ProductsPage

ProductDetailPage

CategoriesPage

AboutPage

ContactPage

Data:

data/

products

categories

Types:

types/

Create clear TypeScript interfaces.

Example product structure:

id

name

slug

category

productCode

price

description

material

size

colors

images

featured

Example category structure:

id

name

slug

image

description

TECHNICAL REQUIREMENTS

Build using:

React

TypeScript

Modern component-based architecture

Responsive design

Clean reusable components

Tailwind CSS

React Router for page navigation

Use mock data initially.

Do not connect to a backend yet.

However, structure the project so it can easily be connected to a backend API later.

Separate:

UI components

Product data

Types

API services

Use clean and maintainable code.

DATA

Create realistic mock product data.

Include at least 12–20 products.

Each product should have:

Vietnamese product name

Product code

Category

Description

Material

Size

Colors

Multiple images

Price if appropriate

Example product codes:

KC-001
KC-002
KN-001
KB-001
KT-001

IMAGE PRIORITY

Product images are one of the most important elements of this website.

Use large, visually attractive placeholder images related to:

Hair clips

Claw clips

Bow clips

Korean style hair accessories

Minimal hair accessories

Cute colorful hair clips

Make sure product images:

Have consistent aspect ratios

Look visually cohesive

Are displayed prominently

Have rounded corners where appropriate

Do not let text dominate the product cards.

FINAL DESIGN GOAL

The final website should feel like a real, polished product showcase website for a Vietnamese hair accessories brand.

It should feel:

Simple +
Modern +
Elegant +
Trustworthy +
Easy to use

The website should NOT feel like a complicated e-commerce platform.

The primary goal is:

Khách hàng xem sản phẩm → Thích sản phẩm → Nhắn Zalo → Chốt số lượng

Prioritize this conversion flow throughout the entire website.

The most important CTA across the website should always be:

Nhắn Zalo để đặt hàng

Make the final prototype visually polished, production-quality, responsive, and focused on excellent UI and UX.

Avoid generic layouts.

Use thoughtful spacing, strong visual hierarchy, beautiful product presentation, subtle animations, reusable components, and a consistent design system.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9e35fadc-b2ee-4129-9f9d-b1a7d6cfc378).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
