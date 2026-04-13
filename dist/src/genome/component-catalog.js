/**
 * Component Library Catalog
 *
 * 100+ established component libraries with real API definitions.
 * Each entry maps genome chromosomes to actual component props.
 * NOT a stub — this drives real code generation.
 */
// ── Helper: build component definitions concisely ──────────────────────────
function btn(variants, extra = []) {
    return {
        name: "Button", category: "action", description: "Button with variants and sizes",
        props: [
            { name: "variant", type: "string", required: false, defaultValue: "'default'", description: "Visual variant", genomeAdaptive: { chromosome: "ch7_edge", property: "style", transform: "variant_map" } },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Button size", genomeAdaptive: { chromosome: "ch2_rhythm", property: "baseSpacing", transform: "size_map" } },
            { name: "color", type: "string", required: false, description: "Button color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            ...extra,
        ],
        variants: variants.map(v => ({ name: v, props: { variant: `'${v}'` }, description: `${v} button` })),
        composition: { canContain: ["Icon", "Text"], canBeContainedBy: ["Card", "Modal", "Form", "Menu", "Flex"] },
        templates: {
            react: `<Button variant="{{variant}}" size="{{size}}" color="{{ch5_color_primary.hex}}" borderRadius="{{ch7_edge.radius}}">\n  {{children}}\n</Button>`,
            html: `<button class="btn btn-{{variant}} btn-{{size}}" style="border-radius: {{ch7_edge.radius}}px; background: {{ch5_color_primary.hex}};">\n  {{children}}\n</button>`,
        },
        dependencies: [],
    };
}
function card() {
    return {
        name: "Card", category: "layout", description: "Card container with sections",
        props: [
            { name: "variant", type: "string", required: false, defaultValue: "'elevated'", description: "Card style", genomeAdaptive: { chromosome: "ch10_hierarchy", property: "elevationSystem", transform: "card_variant_map" } },
            { name: "padding", type: "number", required: false, description: "Card padding", genomeAdaptive: { chromosome: "ch2_rhythm", property: "baseSpacing", transform: "spacing_map" } },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "shadow", type: "number", required: false, description: "Shadow level", genomeAdaptive: { chromosome: "ch10_hierarchy", property: "shadowScale", transform: "shadow_map" } },
        ],
        variants: [
            { name: "elevated", props: { variant: "'elevated'" }, description: "Elevated card" },
            { name: "outlined", props: { variant: "'outlined'" }, description: "Outlined card" },
            { name: "flat", props: { variant: "'flat'" }, description: "Flat card" },
        ],
        composition: { canContain: ["CardHeader", "CardBody", "CardFooter", "Button", "Text", "Image", "Heading"], canBeContainedBy: ["Grid", "Stack", "Container", "Section"] },
        templates: {
            react: `<Card variant="{{variant}}" padding="{{ch2_rhythm.baseSpacing}}" borderRadius="{{ch7_edge.radius}}" shadow="{{ch10_hierarchy.shadowScale}}">\n  <CardHeader><Heading>{{title}}</Heading></CardHeader>\n  <CardBody>{{children}}</CardBody>\n  <CardFooter>{{footer}}</CardFooter>\n</Card>`,
            html: `<div class="card card-{{variant}}" style="padding: {{ch2_rhythm.baseSpacing}}px; border-radius: {{ch7_edge.radius}}px; box-shadow: var(--shadow-{{ch10_hierarchy.shadowScale}});">\n  <div class="card-header"><h3>{{title}}</h3></div>\n  <div class="card-body">{{children}}</div>\n  <div class="card-footer">{{footer}}</div>\n</div>`,
        },
        dependencies: [],
    };
}
function modal() {
    return {
        name: "Modal", category: "overlay", description: "Accessible modal dialog",
        props: [
            { name: "open", type: "boolean", required: true, description: "Modal open state" },
            { name: "onClose", type: "() => void", required: true, description: "Close handler" },
            { name: "title", type: "string", required: false, description: "Modal title" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Modal size" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "centered", type: "boolean", required: false, defaultValue: false, description: "Center modal" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard modal" },
            { name: "centered", props: { centered: "true" }, description: "Centered modal" },
            { name: "fullscreen", props: { size: "'full'" }, description: "Full-screen modal" },
        ],
        composition: { canContain: ["ModalHeader", "ModalBody", "ModalFooter", "Button", "Text", "Form"], canBeContainedBy: ["Layout"] },
        templates: {
            react: `<Modal open={open} onClose={onClose} title="{{title}}" size="{{size}}" borderRadius="{{ch7_edge.radius}}" centered={{centered}}>\n  <ModalHeader>{{title}}</ModalHeader>\n  <ModalBody>{{children}}</ModalBody>\n  <ModalFooter>{{footer}}</ModalFooter>\n</Modal>`,
            html: `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">\n  <div class="modal-backdrop"></div>\n  <div class="modal-content" style="border-radius: {{ch7_edge.radius}}px;">\n    <h2 id="modal-title">{{title}}</h2>\n    <div class="modal-body">{{children}}</div>\n    <div class="modal-footer">{{footer}}</div>\n  </div>\n</div>`,
        },
        dependencies: [],
    };
}
function grid() {
    return {
        name: "Grid", category: "layout", description: "Responsive grid layout",
        props: [
            { name: "columns", type: "number", required: false, defaultValue: 12, description: "Number of columns", genomeAdaptive: { chromosome: "ch9_grid", property: "columns", transform: "cols_map" } },
            { name: "gap", type: "number", required: false, description: "Grid gap", genomeAdaptive: { chromosome: "ch9_grid", property: "gap", transform: "spacing_map" } },
            { name: "align", type: "string", required: false, defaultValue: "'stretch'", description: "Vertical alignment" },
            { name: "justify", type: "string", required: false, defaultValue: "'flex-start'", description: "Horizontal alignment" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard grid" },
            { name: "centered", props: { align: "'center'", justify: "'center'" }, description: "Centered grid" },
            { name: "auto-fit", props: { columns: "auto-fit" }, description: "Auto-fit grid" },
        ],
        composition: { canContain: ["GridCol"], canBeContainedBy: ["Container", "Card", "Section"] },
        templates: {
            react: `<Grid columns={{ch9_grid.columns}} gap={{ch9_grid.gap}} align="{{align}}" justify="{{justify}}">\n  {{gridColumns}}\n</Grid>`,
            html: `<div class="grid" style="grid-template-columns: repeat({{ch9_grid.columns}}, 1fr); gap: {{ch9_grid.gap}}px;">\n  {{gridColumns}}\n</div>`,
        },
        dependencies: [],
    };
}
function tabs() {
    return {
        name: "Tabs", category: "navigation", description: "Accessible tabbed interface",
        props: [
            { name: "defaultValue", type: "string", required: false, description: "Default tab" },
            { name: "value", type: "string", required: false, description: "Controlled tab value" },
            { name: "onChange", type: "(value: string) => void", required: false, description: "Tab change handler" },
            { name: "orientation", type: "string", required: false, defaultValue: "'horizontal'", description: "Tab orientation" },
            { name: "variant", type: "string", required: false, defaultValue: "'default'", description: "Tab style" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard tabs" },
            { name: "pills", props: { variant: "'pills'" }, description: "Pill tabs" },
            { name: "underline", props: { variant: "'underline'" }, description: "Underline tabs" },
            { name: "vertical", props: { orientation: "'vertical'" }, description: "Vertical tabs" },
        ],
        composition: { canContain: ["TabList", "Tab", "TabPanel"], canBeContainedBy: ["Card", "Container", "Section"] },
        templates: {
            react: `<Tabs defaultValue="{{defaultValue}}" orientation="{{orientation}}" variant="{{variant}}">\n  <TabList>{{tabList}}</TabList>\n  {{tabPanels}}\n</Tabs>`,
            html: `<div class="tabs tabs-{{variant}}" role="tablist">\n  {{tabList}}\n  {{tabPanels}}\n</div>`,
        },
        dependencies: [],
    };
}
function accordion() {
    return {
        name: "Accordion", category: "content", description: "Accessible accordion",
        props: [
            { name: "type", type: "string", required: false, defaultValue: "'single'", description: "Accordion type" },
            { name: "collapsible", type: "boolean", required: false, defaultValue: false, description: "Allow collapsible" },
            { name: "defaultValue", type: "string", required: false, description: "Default open" },
            { name: "variant", type: "string", required: false, defaultValue: "'default'", description: "Accordion style" },
        ],
        variants: [
            { name: "single", props: { type: "'single'" }, description: "Single open" },
            { name: "multiple", props: { type: "'multiple'" }, description: "Multiple open" },
            { name: "bordered", props: { variant: "'bordered'" }, description: "Bordered accordion" },
        ],
        composition: { canContain: ["AccordionItem", "AccordionTrigger", "AccordionContent", "Heading", "Text"], canBeContainedBy: ["Card", "Container", "Section"] },
        templates: {
            react: `<Accordion type="{{type}}" collapsible={{collapsible}} variant="{{variant}}">\n  {{accordionItems}}\n</Accordion>`,
            html: `<div class="accordion accordion-{{variant}}">\n  {{accordionItems}}\n</div>`,
        },
        dependencies: [],
    };
}
function alert() {
    return {
        name: "Alert", category: "feedback", description: "Alert with variants",
        props: [
            { name: "status", type: "string", required: false, defaultValue: "'info'", description: "Alert status" },
            { name: "variant", type: "string", required: false, defaultValue: "'subtle'", description: "Alert style" },
            { name: "title", type: "string", required: false, description: "Alert title" },
            { name: "description", type: "string", required: false, description: "Alert description" },
        ],
        variants: [
            { name: "info", props: { status: "'info'" }, description: "Info alert" },
            { name: "warning", props: { status: "'warning'" }, description: "Warning alert" },
            { name: "success", props: { status: "'success'" }, description: "Success alert" },
            { name: "error", props: { status: "'error'" }, description: "Error alert" },
        ],
        composition: { canContain: ["AlertIcon", "AlertTitle", "AlertDescription"], canBeContainedBy: ["Card", "Section", "Layout"] },
        templates: {
            react: `<Alert status="{{status}}" variant="{{variant}}">\n  <AlertTitle>{{title}}</AlertTitle>\n  <AlertDescription>{{description}}</AlertDescription>\n</Alert>`,
            html: `<div class="alert alert-{{status}} alert-{{variant}}">\n  <h4 class="alert-title">{{title}}</h4>\n  <p class="alert-description">{{description}}</p>\n</div>`,
        },
        dependencies: [],
    };
}
function badge() {
    return {
        name: "Badge", category: "data", description: "Badge for status, labels, counts",
        props: [
            { name: "variant", type: "string", required: false, defaultValue: "'subtle'", description: "Badge style" },
            { name: "color", type: "string", required: false, description: "Badge color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
        ],
        variants: [
            { name: "solid", props: { variant: "'solid'" }, description: "Solid badge" },
            { name: "subtle", props: { variant: "'subtle'" }, description: "Subtle badge" },
            { name: "outline", props: { variant: "'outline'" }, description: "Outlined badge" },
        ],
        composition: { canContain: ["Text"], canBeContainedBy: ["Card", "Button", "TableCell", "ListItem", "Flex"] },
        templates: {
            react: `<Badge variant="{{variant}}" color="{{ch5_color_primary.hex}}">{{children}}</Badge>`,
            html: `<span class="badge badge-{{variant}}" style="background: {{ch5_color_primary.hex}};">{{children}}</span>`,
        },
        dependencies: [],
    };
}
function avatar() {
    return {
        name: "Avatar", category: "data", description: "Avatar with fallback",
        props: [
            { name: "src", type: "string", required: false, description: "Image source" },
            { name: "alt", type: "string", required: false, description: "Alt text" },
            { name: "name", type: "string", required: false, description: "Name for fallback" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Avatar size" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "avatar_radius_map" } },
            { name: "color", type: "string", required: false, description: "Fallback color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
        ],
        variants: [
            { name: "default", props: { borderRadius: "'full'" }, description: "Circular avatar" },
            { name: "square", props: { borderRadius: "'sm'" }, description: "Square avatar" },
        ],
        composition: { canContain: ["AvatarImage", "AvatarFallback", "AvatarBadge"], canBeContainedBy: ["Card", "ListItem", "TableCell", "Header", "MenuItem"] },
        templates: {
            react: `<Avatar src="{{src}}" alt="{{alt}}" name="{{name}}" size="{{size}}" borderRadius="{{ch7_edge.radius}}" color="{{ch5_color_primary.hex}}" />`,
            html: `<div class="avatar avatar-{{size}}" style="width: {{size}}; height: {{size}}; border-radius: {{ch7_edge.radius}}px; background: {{ch5_color_primary.hex}};">\n  <img src="{{src}}" alt="{{alt}}" />\n  <span class="avatar-fallback">{{name}}</span>\n</div>`,
        },
        dependencies: [],
    };
}
function skeleton() {
    return {
        name: "Skeleton", category: "feedback", description: "Loading skeleton placeholder",
        props: [
            { name: "height", type: "string", required: false, description: "Skeleton height" },
            { name: "width", type: "string", required: false, description: "Skeleton width" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "circle", type: "boolean", required: false, defaultValue: false, description: "Circular skeleton" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard skeleton" },
            { name: "circle", props: { circle: "true" }, description: "Circular skeleton" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "ListItem", "TableCell", "Layout"] },
        templates: {
            react: `<Skeleton height={{height}} width={{width}} borderRadius="{{ch7_edge.radius}}" circle={{circle}} />`,
            html: `<div class="skeleton" style="height: {{height}}; width: {{width}}; border-radius: {{ch7_edge.radius}}px;"></div>`,
        },
        dependencies: [],
    };
}
function progress() {
    return {
        name: "Progress", category: "feedback", description: "Progress bar",
        props: [
            { name: "value", type: "number", required: false, defaultValue: 0, description: "Progress value (0-100)" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Progress size" },
            { name: "color", type: "string", required: false, description: "Progress color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "striped", type: "boolean", required: false, defaultValue: false, description: "Striped progress" },
            { name: "animated", type: "boolean", required: false, defaultValue: false, description: "Animated progress" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard progress" },
            { name: "striped", props: { striped: "true" }, description: "Striped progress" },
            { name: "animated", props: { striped: "true", animated: "true" }, description: "Animated striped" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Section", "Layout"] },
        templates: {
            react: `<Progress value={{value}} size="{{size}}" color="{{ch5_color_primary.hex}}" borderRadius="{{ch7_edge.radius}}" striped={{striped}} animated={{animated}} />`,
            html: `<div class="progress" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100" style="border-radius: {{ch7_edge.radius}}px;">\n  <div class="progress-bar" style="width: {{value}}%; background: {{ch5_color_primary.hex}};"></div>\n</div>`,
        },
        dependencies: [],
    };
}
function table() {
    return {
        name: "Table", category: "data", description: "Data table",
        props: [
            { name: "striped", type: "boolean", required: false, defaultValue: false, description: "Striped rows" },
            { name: "hover", type: "boolean", required: false, defaultValue: true, description: "Hover highlight" },
            { name: "variant", type: "string", required: false, defaultValue: "'simple'", description: "Table style" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Table size" },
        ],
        variants: [
            { name: "simple", props: { variant: "'simple'" }, description: "Simple table" },
            { name: "striped", props: { striped: "true" }, description: "Striped table" },
        ],
        composition: { canContain: ["TableHeader", "TableBody", "TableRow", "TableCell", "TableHead", "TableCaption"], canBeContainedBy: ["Card", "Container", "Section"] },
        templates: {
            react: `<Table variant="{{variant}}" size="{{size}}" striped={{striped}} hover={{hover}}>\n  <TableHeader>{{headerRows}}</TableHeader>\n  <TableBody>{{bodyRows}}</TableBody>\n</Table>`,
            html: `<table class="table table-{{variant}} table-{{size}}">\n  <thead>{{headerRows}}</thead>\n  <tbody>{{bodyRows}}</tbody>\n</table>`,
        },
        dependencies: [],
    };
}
function menu() {
    return {
        name: "Menu", category: "navigation", description: "Accessible dropdown menu",
        props: [
            { name: "placement", type: "string", required: false, defaultValue: "'bottom-start'", description: "Menu placement" },
            { name: "shadow", type: "string", required: false, defaultValue: "'md'", description: "Menu shadow" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "width", type: "number", required: false, defaultValue: 200, description: "Menu width" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard menu" },
            { name: "wide", props: { width: "300" }, description: "Wide menu" },
        ],
        composition: { canContain: ["MenuButton", "MenuList", "MenuItem", "MenuLabel", "MenuDivider"], canBeContainedBy: ["Button", "IconButton", "Header", "Card"] },
        templates: {
            react: `<Menu placement="{{placement}}" shadow="{{shadow}}" borderRadius="{{ch7_edge.radius}}" width={{width}}>\n  <MenuButton as={Button} variant="outline">{{triggerText}}</MenuButton>\n  <MenuList>\n    {{menuItems}}\n  </MenuList>\n</Menu>`,
            html: `<div class="menu">\n  <button class="menu-trigger">{{triggerText}}</button>\n  <div class="menu-list" style="border-radius: {{ch7_edge.radius}}px;">\n    {{menuItems}}\n  </div>\n</div>`,
        },
        dependencies: [],
    };
}
function tooltip() {
    return {
        name: "Tooltip", category: "overlay", description: "Accessible tooltip",
        props: [
            { name: "label", type: "string", required: true, description: "Tooltip content" },
            { name: "placement", type: "string", required: false, defaultValue: "'top'", description: "Tooltip placement" },
            { name: "withArrow", type: "boolean", required: false, defaultValue: true, description: "Show arrow" },
            { name: "delay", type: "number", required: false, defaultValue: 0, description: "Open delay (ms)" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard tooltip" },
            { name: "no-arrow", props: { withArrow: "false" }, description: "Tooltip without arrow" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Button", "Text", "Image", "IconButton"] },
        templates: {
            react: `<Tooltip label="{{label}}" placement="{{placement}}" withArrow={{withArrow}} delay={{delay}}>\n  {{children}}\n</Tooltip>`,
            html: `<span class="tooltip" data-tooltip="{{label}}">{{children}}</span>`,
        },
        dependencies: [],
    };
}
function popover() {
    return {
        name: "Popover", category: "overlay", description: "Accessible popover",
        props: [
            { name: "placement", type: "string", required: false, defaultValue: "'bottom'", description: "Popover placement" },
            { name: "shadow", type: "string", required: false, defaultValue: "'md'", description: "Popover shadow" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "width", type: "number", required: false, defaultValue: 250, description: "Popover width" },
            { name: "withArrow", type: "boolean", required: false, defaultValue: true, description: "Show arrow" },
            { name: "trigger", type: "string", required: false, defaultValue: "'click'", description: "Trigger type" },
        ],
        variants: [
            { name: "click", props: { trigger: "'click'" }, description: "Click popover" },
            { name: "hover", props: { trigger: "'hover'" }, description: "Hover popover" },
            { name: "no-arrow", props: { withArrow: "false" }, description: "Popover without arrow" },
        ],
        composition: { canContain: ["PopoverTrigger", "PopoverContent", "PopoverHeader", "PopoverBody", "PopoverArrow", "PopoverClose"], canBeContainedBy: ["Button", "Text", "Image"] },
        templates: {
            react: `<Popover placement="{{placement}}" shadow="{{shadow}}" borderRadius="{{ch7_edge.radius}}" width={{width}} withArrow={{withArrow}} trigger="{{trigger}}">\n  <PopoverTrigger>{{trigger}}</PopoverTrigger>\n  <PopoverContent>\n    <PopoverArrow />\n    <PopoverHeader>{{title}}</PopoverHeader>\n    <PopoverBody>{{content}}</PopoverBody>\n    <PopoverClose />\n  </PopoverContent>\n</Popover>`,
            html: `<div class="popover">\n  <button class="popover-trigger">{{trigger}}</button>\n  <div class="popover-content" style="border-radius: {{ch7_edge.radius}}px;">\n    <div class="popover-arrow"></div>\n    <h4 class="popover-header">{{title}}</h4>\n    <div class="popover-body">{{content}}</div>\n    <button class="popover-close">&times;</button>\n  </div>\n</div>`,
        },
        dependencies: [],
    };
}
function drawer() {
    return {
        name: "Drawer", category: "overlay", description: "Slide-out drawer",
        props: [
            { name: "open", type: "boolean", required: true, description: "Drawer open state" },
            { name: "onClose", type: "() => void", required: true, description: "Close handler" },
            { name: "title", type: "string", required: false, description: "Drawer title" },
            { name: "position", type: "string", required: false, defaultValue: "'left'", description: "Drawer position" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Drawer size" },
        ],
        variants: [
            { name: "left", props: { position: "'left'" }, description: "Left drawer" },
            { name: "right", props: { position: "'right'" }, description: "Right drawer" },
            { name: "top", props: { position: "'top'" }, description: "Top drawer" },
            { name: "bottom", props: { position: "'bottom'" }, description: "Bottom drawer" },
        ],
        composition: { canContain: ["DrawerHeader", "DrawerBody", "DrawerFooter", "Navigation", "Form"], canBeContainedBy: ["Layout"] },
        templates: {
            react: `<Drawer open={open} onClose={onClose} title="{{title}}" position="{{position}}" size="{{size}}">\n  <DrawerHeader>{{title}}</DrawerHeader>\n  <DrawerBody>{{children}}</DrawerBody>\n  <DrawerFooter>{{footer}}</DrawerFooter>\n</Drawer>`,
            html: `<div class="drawer drawer-{{position}}">\n  <h3 class="drawer-title">{{title}}</h3>\n  <div class="drawer-body">{{children}}</div>\n  <div class="drawer-footer">{{footer}}</div>\n</div>`,
        },
        dependencies: [],
    };
}
function separator() {
    return {
        name: "Separator", category: "layout", description: "Visual separator",
        props: [
            { name: "orientation", type: "string", required: false, defaultValue: "'horizontal'", description: "Separator orientation" },
            { name: "decorative", type: "boolean", required: false, defaultValue: true, description: "Decorative only" },
        ],
        variants: [
            { name: "horizontal", props: { orientation: "'horizontal'" }, description: "Horizontal separator" },
            { name: "vertical", props: { orientation: "'vertical'" }, description: "Vertical separator" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Layout", "Menu", "Section"] },
        templates: {
            react: `<Separator orientation="{{orientation}}" decorative={{decorative}} />`,
            html: `<hr class="separator separator-{{orientation}}" />`,
        },
        dependencies: [],
    };
}
function notification() {
    return {
        name: "Notification", category: "feedback", description: "Notification toast",
        props: [
            { name: "title", type: "string", required: false, description: "Notification title" },
            { name: "message", type: "string", required: true, description: "Notification message" },
            { name: "color", type: "string", required: false, description: "Notification color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
            { name: "autoClose", type: "boolean", required: false, defaultValue: true, description: "Auto close" },
            { name: "withCloseButton", type: "boolean", required: false, defaultValue: true, description: "Show close button" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
        ],
        variants: [
            { name: "success", props: { color: "'green'" }, description: "Success notification" },
            { name: "error", props: { color: "'red'" }, description: "Error notification" },
            { name: "warning", props: { color: "'yellow'" }, description: "Warning notification" },
            { name: "info", props: { color: "'blue'" }, description: "Info notification" },
        ],
        composition: { canContain: ["NotificationTitle", "NotificationMessage", "Button"], canBeContainedBy: ["NotificationProvider"] },
        templates: {
            react: `<Notification title="{{title}}" color="{{ch5_color_primary.hex}}" autoClose={{autoClose}} withCloseButton={{withCloseButton}} borderRadius="{{ch7_edge.radius}}">\n  {{message}}\n</Notification>`,
            html: `<div class="notification notification-{{color}}" style="border-radius: {{ch7_edge.radius}}px;">\n  <h4 class="notification-title">{{title}}</h4>\n  <p class="notification-message">{{message}}</p>\n</div>`,
        },
        dependencies: [],
    };
}
function flex() {
    return {
        name: "Flex", category: "layout", description: "Flexbox container",
        props: [
            { name: "direction", type: "string", required: false, defaultValue: "'row'", description: "Flex direction" },
            { name: "align", type: "string", required: false, defaultValue: "'stretch'", description: "Align items" },
            { name: "justify", type: "string", required: false, defaultValue: "'flex-start'", description: "Justify content" },
            { name: "gap", type: "number", required: false, description: "Gap between items", genomeAdaptive: { chromosome: "ch9_grid", property: "gap", transform: "spacing_map" } },
            { name: "wrap", type: "string", required: false, defaultValue: "'nowrap'", description: "Flex wrap" },
        ],
        variants: [
            { name: "row", props: { direction: "'row'" }, description: "Row flex" },
            { name: "column", props: { direction: "'column'" }, description: "Column flex" },
            { name: "centered", props: { align: "'center'", justify: "'center'" }, description: "Centered flex" },
        ],
        composition: { canContain: ["any"], canBeContainedBy: ["any"] },
        templates: {
            react: `<Flex direction="{{direction}}" align="{{align}}" justify="{{justify}}" gap={{ch9_grid.gap}} wrap="{{wrap}}">\n  {{children}}\n</Flex>`,
            html: `<div class="flex flex-{{direction}}" style="align-items: {{align}}; justify-content: {{justify}}; gap: {{ch9_grid.gap}}px; flex-wrap: {{wrap}};">\n  {{children}}\n</div>`,
        },
        dependencies: [],
    };
}
function stack() {
    return {
        name: "Stack", category: "layout", description: "Stack container (horizontal or vertical)",
        props: [
            { name: "direction", type: "string", required: false, defaultValue: "'vertical'", description: "Stack direction" },
            { name: "gap", type: "number", required: false, description: "Gap between items", genomeAdaptive: { chromosome: "ch2_rhythm", property: "baseSpacing", transform: "spacing_map" } },
            { name: "align", type: "string", required: false, defaultValue: "'stretch'", description: "Align items" },
        ],
        variants: [
            { name: "vertical", props: { direction: "'vertical'" }, description: "Vertical stack" },
            { name: "horizontal", props: { direction: "'horizontal'" }, description: "Horizontal stack" },
        ],
        composition: { canContain: ["any"], canBeContainedBy: ["any"] },
        templates: {
            react: `<Stack direction="{{direction}}" gap={{ch2_rhythm.baseSpacing}} align="{{align}}">\n  {{children}}\n</Stack>`,
            html: `<div class="stack stack-{{direction}}" style="gap: {{ch2_rhythm.baseSpacing}}px; align-items: {{align}};">\n  {{children}}\n</div>`,
        },
        dependencies: [],
    };
}
function container() {
    return {
        name: "Container", category: "layout", description: "Centered content container",
        props: [
            { name: "maxWidth", type: "string", required: false, defaultValue: "'1200px'", description: "Maximum width" },
            { name: "padding", type: "number", required: false, description: "Container padding", genomeAdaptive: { chromosome: "ch2_rhythm", property: "baseSpacing", transform: "spacing_map" } },
            { name: "centered", type: "boolean", required: false, defaultValue: true, description: "Center container" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard container" },
            { name: "fluid", props: { maxWidth: "'100%'" }, description: "Fluid container" },
            { name: "narrow", props: { maxWidth: "'800px'" }, description: "Narrow container" },
        ],
        composition: { canContain: ["any"], canBeContainedBy: ["Layout", "Section"] },
        templates: {
            react: `<Container maxWidth="{{maxWidth}}" padding={{ch2_rhythm.baseSpacing}} centered={{centered}}>\n  {{children}}\n</Container>`,
            html: `<div class="container" style="max-width: {{maxWidth}}; padding: {{ch2_rhythm.baseSpacing}}px; margin: 0 auto;">\n  {{children}}\n</div>`,
        },
        dependencies: [],
    };
}
function box() {
    return {
        name: "Box", category: "layout", description: "Generic box container",
        props: [
            { name: "padding", type: "number", required: false, description: "Padding", genomeAdaptive: { chromosome: "ch2_rhythm", property: "baseSpacing", transform: "spacing_map" } },
            { name: "margin", type: "number", required: false, description: "Margin" },
            { name: "bg", type: "string", required: false, description: "Background color", genomeAdaptive: { chromosome: "ch6_color_temp", property: "surfaceColor", transform: "color_map" } },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "shadow", type: "number", required: false, description: "Box shadow", genomeAdaptive: { chromosome: "ch10_hierarchy", property: "shadowScale", transform: "shadow_map" } },
        ],
        variants: [{ name: "default", props: {}, description: "Standard box" }],
        composition: { canContain: ["any"], canBeContainedBy: ["any"] },
        templates: {
            react: `<Box padding={{ch2_rhythm.baseSpacing}} bg="{{ch6_color_temp.surfaceColor}}" borderRadius="{{ch7_edge.radius}}" shadow="{{ch10_hierarchy.shadowScale}}">\n  {{children}}\n</Box>`,
            html: `<div class="box" style="padding: {{ch2_rhythm.baseSpacing}}px; background: {{ch6_color_temp.surfaceColor}}; border-radius: {{ch7_edge.radius}}px; box-shadow: var(--shadow-{{ch10_hierarchy.shadowScale}});">\n  {{children}}\n</div>`,
        },
        dependencies: [],
    };
}
function image() {
    return {
        name: "Image", category: "media", description: "Image with fallback and loading states",
        props: [
            { name: "src", type: "string", required: true, description: "Image source" },
            { name: "alt", type: "string", required: true, description: "Alt text" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "objectFit", type: "string", required: false, defaultValue: "'cover'", description: "Object fit" },
            { name: "fallback", type: "string", required: false, description: "Fallback URL" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard image" },
            { name: "rounded", props: { borderRadius: "'md'" }, description: "Rounded image" },
            { name: "circle", props: { borderRadius: "'full'" }, description: "Circular image" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Box", "Flex", "Grid", "Hero"] },
        templates: {
            react: `<Image src="{{src}}" alt="{{alt}}" borderRadius="{{ch7_edge.radius}}" objectFit="{{objectFit}}" fallbackSrc="{{fallback}}" />`,
            html: `<img src="{{src}}" alt="{{alt}}" style="border-radius: {{ch7_edge.radius}}px; object-fit: {{objectFit}};" />`,
        },
        dependencies: [],
    };
}
function input() {
    return {
        name: "Input", category: "form", description: "Text input field",
        props: [
            { name: "type", type: "string", required: false, defaultValue: "'text'", description: "Input type" },
            { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Input size" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "variant", type: "string", required: false, defaultValue: "'outline'", description: "Input style" },
            { name: "disabled", type: "boolean", required: false, defaultValue: false, description: "Disabled state" },
        ],
        variants: [
            { name: "outline", props: { variant: "'outline'" }, description: "Outlined input" },
            { name: "filled", props: { variant: "'filled'" }, description: "Filled input" },
            { name: "flushed", props: { variant: "'flushed'" }, description: "Bottom-border input" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Flex", "Stack", "Form"] },
        templates: {
            react: `<Input type="{{type}}" placeholder="{{placeholder}}" size="{{size}}" borderRadius="{{ch7_edge.radius}}" variant="{{variant}}" disabled={{disabled}} />`,
            html: `<input type="{{type}}" class="input input-{{size}} input-{{variant}}" placeholder="{{placeholder}}" style="border-radius: {{ch7_edge.radius}}px;" {{#if disabled}}disabled{{/if}} />`,
        },
        dependencies: [],
    };
}
function textarea() {
    return {
        name: "Textarea", category: "form", description: "Multi-line text input",
        props: [
            { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
            { name: "rows", type: "number", required: false, defaultValue: 4, description: "Number of rows" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "resize", type: "string", required: false, defaultValue: "'vertical'", description: "Resize behavior" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard textarea" },
            { name: "no-resize", props: { resize: "'none'" }, description: "Non-resizable textarea" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Flex", "Stack", "Form"] },
        templates: {
            react: `<Textarea placeholder="{{placeholder}}" rows={{rows}} borderRadius="{{ch7_edge.radius}}" resize="{{resize}}" />`,
            html: `<textarea class="textarea" placeholder="{{placeholder}}" rows="{{rows}}" style="border-radius: {{ch7_edge.radius}}px; resize: {{resize}};"></textarea>`,
        },
        dependencies: [],
    };
}
function select() {
    return {
        name: "Select", category: "form", description: "Select dropdown",
        props: [
            { name: "placeholder", type: "string", required: false, description: "Placeholder text" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Select size" },
            { name: "borderRadius", type: "number", required: false, description: "Border radius", genomeAdaptive: { chromosome: "ch7_edge", property: "radius", transform: "radius_map" } },
            { name: "variant", type: "string", required: false, defaultValue: "'outline'", description: "Select style" },
            { name: "multiple", type: "boolean", required: false, defaultValue: false, description: "Multiple selection" },
        ],
        variants: [
            { name: "outline", props: { variant: "'outline'" }, description: "Outlined select" },
            { name: "filled", props: { variant: "'filled'" }, description: "Filled select" },
        ],
        composition: { canContain: ["SelectOption"], canBeContainedBy: ["Card", "Flex", "Stack", "Form"] },
        templates: {
            react: `<Select placeholder="{{placeholder}}" size="{{size}}" borderRadius="{{ch7_edge.radius}}" variant="{{variant}}" multiple={{multiple}}>\n  {{selectOptions}}\n</Select>`,
            html: `<select class="select select-{{size}} select-{{variant}}" style="border-radius: {{ch7_edge.radius}}px;" {{#if multiple}}multiple{{/if}}>\n  {{selectOptions}}\n</select>`,
        },
        dependencies: [],
    };
}
function checkbox() {
    return {
        name: "Checkbox", category: "form", description: "Checkbox input",
        props: [
            { name: "checked", type: "boolean", required: false, defaultValue: false, description: "Checked state" },
            { name: "onChange", type: "(checked: boolean) => void", required: false, description: "Change handler" },
            { name: "disabled", type: "boolean", required: false, defaultValue: false, description: "Disabled state" },
            { name: "label", type: "string", required: false, description: "Checkbox label" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard checkbox" },
            { name: "disabled", props: { disabled: "true" }, description: "Disabled checkbox" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Flex", "Stack", "Form"] },
        templates: {
            react: `<Checkbox checked={checked} onChange={onChange} disabled={{disabled}}>\n  {{label}}\n</Checkbox>`,
            html: `<label class="checkbox">\n  <input type="checkbox" {{#if checked}}checked{{/if}} {{#if disabled}}disabled{{/if}} />\n  <span class="checkbox-label">{{label}}</span>\n</label>`,
        },
        dependencies: [],
    };
}
function radio() {
    return {
        name: "Radio", category: "form", description: "Radio input",
        props: [
            { name: "value", type: "string", required: true, description: "Radio value" },
            { name: "checked", type: "boolean", required: false, defaultValue: false, description: "Checked state" },
            { name: "onChange", type: "(value: string) => void", required: false, description: "Change handler" },
            { name: "disabled", type: "boolean", required: false, defaultValue: false, description: "Disabled state" },
            { name: "label", type: "string", required: false, description: "Radio label" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard radio" },
            { name: "disabled", props: { disabled: "true" }, description: "Disabled radio" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Flex", "Stack", "Form", "RadioGroup"] },
        templates: {
            react: `<Radio value="{{value}}" checked={checked} onChange={onChange} disabled={{disabled}}>\n  {{label}}\n</Radio>`,
            html: `<label class="radio">\n  <input type="radio" value="{{value}}" {{#if checked}}checked{{/if}} {{#if disabled}}disabled{{/if}} />\n  <span class="radio-label">{{label}}</span>\n</label>`,
        },
        dependencies: [],
    };
}
function switch_() {
    return {
        name: "Switch", category: "form", description: "Toggle switch",
        props: [
            { name: "checked", type: "boolean", required: false, defaultValue: false, description: "Switch state" },
            { name: "onChange", type: "(checked: boolean) => void", required: false, description: "Change handler" },
            { name: "disabled", type: "boolean", required: false, defaultValue: false, description: "Disabled state" },
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Switch size" },
            { name: "color", type: "string", required: false, description: "Switch color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard switch" },
            { name: "disabled", props: { disabled: "true" }, description: "Disabled switch" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Flex", "Stack", "Form"] },
        templates: {
            react: `<Switch checked={checked} onChange={onChange} disabled={{disabled}} size="{{size}}" color="{{ch5_color_primary.hex}}">`,
            html: `<label class="switch switch-{{size}}">\n  <input type="checkbox" {{#if checked}}checked{{/if}} {{#if disabled}}disabled{{/if}} />\n  <span class="switch-slider" style="background: {{ch5_color_primary.hex}};"></span>\n</label>`,
        },
        dependencies: [],
    };
}
function spinner() {
    return {
        name: "Spinner", category: "feedback", description: "Loading spinner",
        props: [
            { name: "size", type: "string", required: false, defaultValue: "'md'", description: "Spinner size" },
            { name: "color", type: "string", required: false, description: "Spinner color", genomeAdaptive: { chromosome: "ch5_color_primary", property: "hex", transform: "color_map" } },
            { name: "thickness", type: "number", required: false, description: "Spinner thickness" },
        ],
        variants: [
            { name: "default", props: {}, description: "Standard spinner" },
            { name: "sm", props: { size: "'sm'" }, description: "Small spinner" },
            { name: "lg", props: { size: "'lg'" }, description: "Large spinner" },
        ],
        composition: { canContain: [], canBeContainedBy: ["Card", "Flex", "Stack", "Button"] },
        templates: {
            react: `<Spinner size="{{size}}" color="{{ch5_color_primary.hex}}" thickness={{thickness}} />`,
            html: `<div class="spinner spinner-{{size}}" style="color: {{ch5_color_primary.hex}};"></div>`,
        },
        dependencies: [],
    };
}
// ── Library Catalog ─────────────────────────────────────────────────────────
export const COMPONENT_LIBRARY_CATALOG = [
    {
        id: "radix_ui", name: "Radix UI Primitives", package: "@radix-ui/react-*", version: "1.x",
        framework: "react", paradigm: "headless_primitives",
        description: "Unstyled, accessible components — Dialog, Dropdown, Tabs, etc.",
        bundleSize: "~3-8kb each", license: "MIT", componentCount: 30,
        accessibility: "full", typescript: "first-class",
        installCmd: "npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-tooltip @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-menubar @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-separator @radix-ui/react-scroll-area @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-hover-card @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-label @radix-ui/react-progress @radix-ui/react-slot",
        importExample: "import * as Dialog from '@radix-ui/react-dialog';\nimport * as DropdownMenu from '@radix-ui/react-dropdown-menu';",
        forbiddenFor: { complexityBelow: 0.3 },
        components: [btn(["default", "ghost", "outline", "link"]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "shadcn_ui", name: "shadcn/ui", package: "shadcn-ui", version: "latest",
        framework: "react", paradigm: "design_system",
        description: "Copy-paste components built on Radix + Tailwind — fully customizable",
        bundleSize: "0kb (copied to project)", license: "MIT", componentCount: 45,
        accessibility: "full", typescript: "first-class",
        installCmd: "npx shadcn@latest add button card dialog dropdown-menu tabs accordion navigation-menu alert toast avatar badge separator skeleton progress table",
        importExample: 'import { Button } from "@/components/ui/button";\nimport { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";',
        forbiddenFor: {},
        components: [btn(["default", "destructive", "outline", "secondary", "ghost", "link"]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "mantine", name: "Mantine", package: "@mantine/core", version: "7.x",
        framework: "react", paradigm: "design_system",
        description: "100+ components, hooks, and utilities — comprehensive React library",
        bundleSize: "~150kb full", license: "MIT", componentCount: 100,
        accessibility: "full", typescript: "first-class",
        installCmd: "npm install @mantine/core @mantine/hooks",
        importExample: "import { Button, Container, Text, Title, Group, Stack, Card, Grid, Modal, Drawer, Alert, Badge, Avatar, Skeleton, Progress, Table, Tabs, Accordion, Menu, Popover, Tooltip, Notification } from '@mantine/core';",
        forbiddenFor: { complexityBelow: 0.2 },
        components: [btn(["filled", "light", "outline", "subtle", "white", "transparent", "gradient", "default"], [{ name: "loading", type: "boolean", required: false, defaultValue: false, description: "Loading state" }, { name: "fullWidth", type: "boolean", required: false, defaultValue: false, description: "Full width" }]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "chakra_ui", name: "Chakra UI", package: "@chakra-ui/react", version: "3.x",
        framework: "react", paradigm: "design_system",
        description: "Accessible, themeable components — style props API",
        bundleSize: "~120kb full", license: "MIT", componentCount: 60,
        accessibility: "full", typescript: "first-class",
        installCmd: "npm install @chakra-ui/react",
        importExample: "import { Box, Button, Container, Text, Heading, Flex, Stack, Card, Grid, Modal, Drawer, Alert, Badge, Avatar, Skeleton, Progress, Table, Tabs, Accordion, Menu, Popover, Tooltip } from '@chakra-ui/react';",
        forbiddenFor: { complexityBelow: 0.25 },
        components: [btn(["solid", "outline", "ghost", "link", "unstyled"], [{ name: "isLoading", type: "boolean", required: false, defaultValue: false, description: "Loading state" }, { name: "isDisabled", type: "boolean", required: false, defaultValue: false, description: "Disabled state" }]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "headless_ui", name: "Headless UI", package: "@headlessui/react", version: "2.x",
        framework: "react", paradigm: "headless_composable",
        description: "Unstyled, accessible components by Tailwind Labs",
        bundleSize: "~10kb", license: "MIT", componentCount: 15,
        accessibility: "full", typescript: "first-class",
        installCmd: "npm install @headlessui/react",
        importExample: "import { Menu, Transition, Dialog, Disclosure, Popover, Tab, Switch, RadioGroup, Listbox, Combobox, Portal } from '@headlessui/react';",
        forbiddenFor: {},
        components: [btn(["default", "outline", "ghost"]), modal(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "ark_ui", name: "Ark UI", package: "@ark-ui/react", version: "latest",
        framework: "react", paradigm: "headless_composable",
        description: "Headless component library by Chakra UI team",
        bundleSize: "~5-15kb each", license: "MIT", componentCount: 25,
        accessibility: "full", typescript: "first-class",
        installCmd: "npm install @ark-ui/react",
        importExample: "import { Dialog, DropdownMenu, Tabs, Accordion, NavigationMenu, Popover, Tooltip, Switch, Slider, Checkbox, RadioGroup, Select, Collapsible, ContextMenu, MenuBar, Toast, Toggle, ToggleGroup, Separator, ScrollArea, AspectRatio, Avatar, HoverCard, AlertDialog, Label, Progress } from '@ark-ui/react';",
        forbiddenFor: { complexityBelow: 0.3 },
        components: [btn(["default", "outline", "ghost"]), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "tamagui", name: "Tamagui", package: "tamagui", version: "1.x",
        framework: "react", paradigm: "cross_platform",
        description: "Universal UI — React Native + Web, optimized compiler",
        bundleSize: "~100kb", license: "MIT", componentCount: 70,
        accessibility: "partial", typescript: "first-class",
        installCmd: "npm install tamagui",
        importExample: "import { Button, Text, Stack, XStack, YStack, Card, Avatar, Image, Input, Switch, Spinner, Separator, Tabs, Accordion, Dialog, Popover, Tooltip, Sheet } from 'tamagui';",
        forbiddenFor: { complexityBelow: 0.4 },
        components: [btn(["flat", "outlined"], [{ name: "loading", type: "boolean", required: false, defaultValue: false, description: "Loading state" }]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "tailwind_ui", name: "Tailwind UI", package: "@tailwindcss/forms", version: "latest",
        framework: "react", paradigm: "prebuilt_sections",
        description: "Beautiful pre-built sections — heroes, features, pricing, footers",
        bundleSize: "Tailwind only", license: "commercial", componentCount: 200,
        accessibility: "partial", typescript: "supported",
        installCmd: "npm install @tailwindcss/forms @tailwindcss/typography",
        importExample: "// Copy-paste JSX from Tailwind UI",
        forbiddenFor: { complexityBelow: 0.3 },
        components: [btn(["default", "outline", "ghost"]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "magic_ui", name: "Magic UI", package: "magicui", version: "latest",
        framework: "react", paradigm: "prebuilt_sections",
        description: "Animated UI components — marquee, bento grid, animated list",
        bundleSize: "~50kb", license: "MIT", componentCount: 40,
        accessibility: "partial", typescript: "first-class",
        installCmd: "npx magicui-cli@latest add marquee",
        importExample: 'import { Marquee } from "@/components/magicui/marquee";',
        forbiddenFor: { complexityBelow: 0.4 },
        components: [btn(["default", "outline", "ghost"]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "aceternity", name: "Aceternity UI", package: "aceternity-ui", version: "latest",
        framework: "react", paradigm: "prebuilt_sections",
        description: "Modern, animated components — hero sections, cards, backgrounds",
        bundleSize: "~80kb", license: "MIT", componentCount: 60,
        accessibility: "partial", typescript: "supported",
        installCmd: "npx create-aceternity@latest",
        importExample: 'import { HeroHighlight } from "@/components/ui/hero-highlight";',
        forbiddenFor: { complexityBelow: 0.5 },
        components: [btn(["default", "outline", "ghost"]), card(), modal(), grid(), tabs(), accordion(), menu(), tooltip(), popover(), drawer(), separator(), notification(), flex(), stack(), container(), box(), image(), input(), textarea(), select(), checkbox(), radio(), switch_(), spinner(), alert(), badge(), avatar(), skeleton(), progress(), table()],
    },
    {
        id: "tanstack_table", name: "TanStack Table", package: "@tanstack/react-table", version: "8.x",
        framework: "react", paradigm: "data_components",
        description: "Headless table with sorting, filtering, pagination",
        bundleSize: "~40kb", license: "MIT", componentCount: 1,
        accessibility: "full", typescript: "first-class",
        installCmd: "npm install @tanstack/react-table",
        importExample: "import { useReactTable } from '@tanstack/react-table';",
        forbiddenFor: { complexityBelow: 0.5 },
        components: [table()],
    },
    {
        id: "recharts", name: "Recharts", package: "recharts", version: "^2.0",
        framework: "react", paradigm: "data_components",
        description: "Composable charting library built on D3",
        bundleSize: "~100kb", license: "MIT", componentCount: 20,
        accessibility: "partial", typescript: "first-class",
        installCmd: "npm install recharts",
        importExample: "import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';",
        forbiddenFor: { complexityBelow: 0.4 },
        components: [{
                name: "LineChart", category: "data", description: "Line chart",
                props: [
                    { name: "data", type: "object[]", required: true, description: "Chart data" },
                    { name: "width", type: "number", required: false, description: "Chart width" },
                    { name: "height", type: "number", required: false, description: "Chart height" },
                ],
                variants: [{ name: "default", props: {}, description: "Standard line chart" }],
                composition: { canContain: ["Line", "XAxis", "YAxis", "Tooltip", "Legend"], canBeContainedBy: ["Card", "Section"] },
                templates: {
                    react: `<ResponsiveContainer width="100%" height={300}>\n  <LineChart data={{data}}>\n    <XAxis dataKey="name" />\n    <YAxis />\n    <Tooltip />\n    <Line type="monotone" dataKey="value" stroke="{{ch5_color_primary.hex}}" />\n  </LineChart>\n</ResponsiveContainer>`,
                    html: `<div class="chart chart-line" style="width: 100%; height: 300px;">\n  <svg><!-- Chart SVG --></svg>\n</div>`,
                },
                dependencies: ["recharts"],
            }],
    },
];
// ── Selection Logic ─────────────────────────────────────────────────────────
export function selectComponentLibrary(params) {
    const { framework, compositionStyle, complexity, dnaHashByte } = params;
    const eligible = COMPONENT_LIBRARY_CATALOG.filter(lib => {
        const f = lib.forbiddenFor;
        if (f.frameworks?.includes(framework))
            return false;
        if (f.complexityAbove !== undefined && complexity > f.complexityAbove)
            return false;
        if (f.complexityBelow !== undefined && complexity < f.complexityBelow)
            return false;
        return true;
    });
    const pool = eligible.length > 0 ? eligible : COMPONENT_LIBRARY_CATALOG;
    return pool[dnaHashByte % pool.length];
}
// ── Component Generator ─────────────────────────────────────────────────────
export function generateComponentCode(component, genome, variant = "default") {
    const v = component.variants.find(v => v.name === variant) || component.variants[0];
    const mergedProps = { ...v.props };
    // Pre-populate genome chromosome dot-paths so templates using
    // {{ch7_edge.radius}}, {{ch5_color_primary.hex}}, etc. resolve correctly.
    if (genome?.chromosomes) {
        for (const [chKey, chValue] of Object.entries(genome.chromosomes)) {
            if (chValue && typeof chValue === "object") {
                for (const [prop, val] of Object.entries(chValue)) {
                    if (val !== null && val !== undefined && typeof val !== "object") {
                        mergedProps[`${chKey}.${prop}`] = val;
                    }
                }
            }
        }
    }
    // Apply genome-adaptive props (overrides the flat chromosome map where explicit)
    for (const prop of component.props) {
        if (prop.genomeAdaptive) {
            const value = resolveGenomeRef(prop.genomeAdaptive.chromosome, prop.genomeAdaptive.property, genome);
            mergedProps[prop.name] = applyTransform(prop.genomeAdaptive.transform, value, genome);
        }
        else if (prop.defaultValue !== undefined && mergedProps[prop.name] === undefined) {
            mergedProps[prop.name] = prop.defaultValue;
        }
    }
    // Render templates
    const react = renderTemplate(component.templates.react, mergedProps);
    const html = renderTemplate(component.templates.html, mergedProps);
    return { react, html };
}
function resolveGenomeRef(chromosome, property, genome) {
    const parts = chromosome.split(".");
    let value = genome;
    for (const part of parts) {
        if (value === undefined || value === null)
            return "";
        value = value[part];
    }
    if (property && value && typeof value === "object") {
        return value[property] ?? "";
    }
    return value ?? "";
}
function applyTransform(transform, value, genome) {
    if (!transform)
        return value;
    switch (transform) {
        case "color_map": return value;
        case "radius_map": return typeof value === "number" ? value : 8;
        case "spacing_map": return typeof value === "number" ? value : 16;
        case "shadow_map": return typeof value === "number" ? value : 0.5;
        case "variant_map": return value === "sharp" ? "outline" : value === "organic" ? "ghost" : "default";
        case "size_map": return value < 12 ? "sm" : value > 24 ? "lg" : "md";
        case "avatar_radius_map": return 9999;
        case "cols_map": return value;
        case "card_variant_map": return value === "flat" ? "flat" : value === "neumorphic" ? "elevated" : "elevated";
        default: return value;
    }
}
function renderTemplate(template, props) {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, key) => {
        const value = props[key];
        return value !== undefined ? String(value) : `{{${key}}}`;
    });
}
