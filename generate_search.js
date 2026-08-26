const fs = require('fs');

let content = fs.readFileSync('d:/lisandrathelabel/sections/main-collection-product-grid-v5.liquid', 'utf-8');

// Replacements for Search
content = content.replace('Main Collection Product Grid V5', 'Main Search Results V5');
content = content.replace(/collection\.products/g, 'search_products');
content = content.replace(/collection\.filters/g, 'search.filters');
content = content.replace(/collection\.sort_by/g, 'search.sort_by');
content = content.replace(/collection\.default_sort_by/g, 'search.default_sort_by');
content = content.replace(/collection\.url/g, '{{ routes.search_url }}');
content = content.replace('Collection Grid V5', 'Search Results V5');
content = content.replace('No products found matching your filters.', 'No products found for "{{ search.terms }}".');

// Insert hidden inputs
const form_start = 'action="{{ routes.search_url }}">\n';
if (content.includes(form_start)) {
    content = content.replace(form_start, form_start + '  <input type="hidden" name="q" value="{{ search.terms | escape }}" />\n  <input type="hidden" name="type" value="product" />\n');
}

// Clear button link fix
const clear_link = '<a href="{{ routes.search_url }}" class="filter-clear-btn-{{ sid }}">Clear</a>';
content = content.replace(clear_link, '<a href="{{ routes.search_url }}?q={{ search.terms | escape }}&type=product" class="filter-clear-btn-{{ sid }}">Clear</a>');

const clear_all_link = '<a href="{{ routes.search_url }}" style="color:#392319;text-decoration:underline;font-size:12px;">Clear all filters</a>';
content = content.replace(clear_all_link, '<a href="{{ routes.search_url }}?q={{ search.terms | escape }}&type=product" style="color:#392319;text-decoration:underline;font-size:12px;">Clear all filters</a>');

// Assign search_products at the top
const top_liquid = '{%- liquid\n  assign sid = section.id\n  assign products_per_page = section.settings.products_per_page | default: 24';
content = content.replace(top_liquid, top_liquid + '\n  assign search_products = search.results | where: \'object_type\', \'product\'');

// Change paginate collection.products to paginate search.results
content = content.replace('paginate search_products by', 'paginate search.results by');

// Remove the collection.handle == sale loop check since search doesn't have a collection handle
const sale_check = `        {%- if collection.handle == 'sale' and product.compare_at_price <= product.price -%}
          {%- continue -%}
        {%- endif -%}`;
content = content.replace(sale_check, '');

fs.writeFileSync('d:/lisandrathelabel/sections/main-search-v5.liquid', content, 'utf-8');
console.log('Success');
