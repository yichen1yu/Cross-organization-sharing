import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { ExternalLinkAltIcon, FileExportIcon, FilterIcon } from '@patternfly/react-icons';

// Chart dimensions and data for static SVG (y in 1K–5K range)
const CHART_DATES = ['Feb 9', 'Feb 14', 'Feb 19', 'Feb 24', 'Mar 1', 'Mar 6', 'Mar 11'];
const CHART_WIDTH = 700;
const CHART_HEIGHT = 280;
const PAD = { top: 20, right: 20, bottom: 50, left: 50 };
const INNER_W = CHART_WIDTH - PAD.left - PAD.right;
const INNER_H = CHART_HEIGHT - PAD.top - PAD.bottom;
const Y_MIN = 0;
const Y_MAX = 5000;

function toPoints(ys: number[]): string {
  return ys
    .map((y, i) => {
      const x = PAD.left + (i / (CHART_DATES.length - 1)) * INNER_W;
      const yNorm = PAD.top + INNER_H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * INNER_H;
      return `${x},${yNorm}`;
    })
    .join(' ');
}

const PHYSICAL_Y = [1200, 800, 900, 2200, 2800, 3200, 3500];
const VIRTUAL_Y = [1800, 1400, 1100, 1600, 2200, 2600, 3000];
const PUBLIC_CLOUD_Y = [800, 600, 500, 900, 1200, 1400, 1600];
const HYPERVISOR_Y = [400, 300, 350, 500, 600, 700, 800];
const THRESHOLD_Y = [4000, 4000, 4000, 4000, 4000, 4000, 4000];

const SubscriptionUsageRHEL: React.FunctionComponent = () => {
  const [variantOpen, setVariantOpen] = React.useState(false);
  const [variant, setVariant] = React.useState('RHEL for x86');
  const [usageFilterOpen, setUsageFilterOpen] = React.useState(false);
  const [usageFilter, setUsageFilter] = React.useState('Past 30 days (daily)');
  const [filterByUsageOpen, setFilterByUsageOpen] = React.useState(false);
  const [chartTimeRangeOpen, setChartTimeRangeOpen] = React.useState(false);
  const [chartTimeRange, setChartTimeRange] = React.useState('Past 30 days (daily)');
  const [exportOpen, setExportOpen] = React.useState(false);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/overview">
            Subscription Services
          </BreadcrumbItem>
          <BreadcrumbItem component={Link} to="/subscription-usage">
            Subscriptions Usage
          </BreadcrumbItem>
          <BreadcrumbItem isActive>RHEL</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              Red Hat Enterprise Linux
            </Title>
            <Content style={{ marginTop: 16 }}>
              <p style={{ margin: 0, color: 'var(--pf-v6-global--Color--200)' }}>
                Monitor your Red Hat Enterprise Linux usage for both Annual and On-Demand subscriptions.{' '}
                <Button
                  variant="link"
                  isInline
                  component="a"
                  href="https://access.redhat.com/documentation/en-us/subscription_central/2024/html/assessing_subscription_usage_in_subscription_central"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="end"
                >
                  Learn more about Subscriptions reporting
                </Button>
              </p>
            </Content>
          </FlexItem>

          {/* Control bar: Variant, Usage, Filter by usage, Export */}
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <span style={{ color: 'var(--pf-v6-global--Color--200)', marginRight: 8 }}>Variant:</span>
                <Dropdown
                  isOpen={variantOpen}
                  onOpenChange={setVariantOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setVariantOpen(!variantOpen)}
                      isExpanded={variantOpen}
                    >
                      {variant}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => { setVariant('RHEL for x86'); setVariantOpen(false); }}>
                      RHEL for x86
                    </DropdownItem>
                    <DropdownItem onClick={() => { setVariant('RHEL for ARM'); setVariantOpen(false); }}>
                      RHEL for ARM
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={usageFilterOpen}
                  onOpenChange={setUsageFilterOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setUsageFilterOpen(!usageFilterOpen)}
                      isExpanded={usageFilterOpen}
                      icon={<FilterIcon />}
                    >
                      Usage
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => { setUsageFilter('Past 30 days (daily)'); setUsageFilterOpen(false); }}>
                      Past 30 days (daily)
                    </DropdownItem>
                    <DropdownItem onClick={() => { setUsageFilter('Past 12 months (monthly)'); setUsageFilterOpen(false); }}>
                      Past 12 months (monthly)
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={filterByUsageOpen}
                  onOpenChange={setFilterByUsageOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setFilterByUsageOpen(!filterByUsageOpen)}
                      isExpanded={filterByUsageOpen}
                    >
                      Filter by usage
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => { setUsageFilter('Past 30 days (daily)'); setFilterByUsageOpen(false); }}>
                      Past 30 days (daily)
                    </DropdownItem>
                    <DropdownItem onClick={() => { setUsageFilter('Past 12 months (monthly)'); setFilterByUsageOpen(false); }}>
                      Past 12 months (monthly)
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={exportOpen}
                  onOpenChange={setExportOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setExportOpen(!exportOpen)}
                      isExpanded={exportOpen}
                      icon={<FileExportIcon />}
                    >
                      Export
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => setExportOpen(false)}>Export as CSV</DropdownItem>
                    <DropdownItem onClick={() => setExportOpen(false)}>Export as PDF</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
            </Flex>
          </FlexItem>

          {/* CPU socket usage section */}
          <FlexItem>
            <Flex
              alignItems={{ default: 'alignItemsCenter' }}
              justifyContent={{ default: 'justifyContentSpaceBetween' }}
              style={{ marginBottom: 16 }}
            >
              <Title headingLevel="h2" size="lg">
                CPU socket usage
              </Title>
              <Dropdown
                isOpen={chartTimeRangeOpen}
                onOpenChange={setChartTimeRangeOpen}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setChartTimeRangeOpen(!chartTimeRangeOpen)}
                    isExpanded={chartTimeRangeOpen}
                  >
                    {chartTimeRange}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem onClick={() => { setChartTimeRange('Past 30 days (daily)'); setChartTimeRangeOpen(false); }}>
                    Past 30 days (daily)
                  </DropdownItem>
                  <DropdownItem onClick={() => { setChartTimeRange('Past 12 months (monthly)'); setChartTimeRangeOpen(false); }}>
                    Past 12 months (monthly)
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </Flex>

            <div style={{ width: '100%', maxWidth: CHART_WIDTH, overflow: 'auto' }} role="img" aria-label="RHEL CPU socket usage over time">
              <svg width={CHART_WIDTH} height={CHART_HEIGHT} style={{ display: 'block' }}>
                <defs>
                  <pattern id="grid" width={INNER_W / 6} height={INNER_H / 4} patternUnits="userSpaceOnUse">
                    <path d={`M ${INNER_W / 6} 0 L 0 0 0 ${INNER_H / 4}`} fill="none" stroke="var(--pf-v6-global--BorderColor--200)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} fill="url(#grid)" />
                {/* Y-axis labels */}
                {[1000, 2000, 3000, 4000, 5000].map((v) => {
                  const y = PAD.top + INNER_H - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * INNER_H;
                  return (
                    <text key={v} x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize={10} fill="var(--pf-v6-global--Color--200)">
                      {v / 1000}K
                    </text>
                  );
                })}
                {/* X-axis labels */}
                {CHART_DATES.map((d, i) => {
                  const x = PAD.left + (i / (CHART_DATES.length - 1)) * INNER_W;
                  return (
                    <text key={d} x={x} y={CHART_HEIGHT - 12} textAnchor="middle" fontSize={10} fill="var(--pf-v6-global--Color--200)">
                      {d}
                    </text>
                  );
                })}
                {/* Lines */}
                <polyline points={toPoints(PHYSICAL_Y)} fill="none" stroke="var(--pf-v6-chart-color-blue-300)" strokeWidth="2" />
                <polyline points={toPoints(VIRTUAL_Y)} fill="none" stroke="var(--pf-v6-chart-color-cyan-300)" strokeWidth="2" />
                <polyline points={toPoints(PUBLIC_CLOUD_Y)} fill="none" stroke="var(--pf-v6-chart-color-purple-300)" strokeWidth="2" />
                <polyline points={toPoints(HYPERVISOR_Y)} fill="none" stroke="var(--pf-v6-chart-color-orange-300)" strokeWidth="2" />
                <polyline points={toPoints(THRESHOLD_Y)} fill="none" stroke="var(--pf-v6-chart-color-green-300)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
              {/* Legend */}
              <Flex style={{ marginTop: 16, flexWrap: 'wrap', gap: 16 }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: 'var(--pf-v6-chart-color-blue-300)', display: 'inline-block' }} /> Physical</span></FlexItem>
                <FlexItem><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: 'var(--pf-v6-chart-color-cyan-300)', display: 'inline-block' }} /> Virtual</span></FlexItem>
                <FlexItem><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: 'var(--pf-v6-chart-color-purple-300)', display: 'inline-block' }} /> Public cloud</span></FlexItem>
                <FlexItem><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, background: 'var(--pf-v6-chart-color-orange-300)', display: 'inline-block' }} /> Hypervisor</span></FlexItem>
                <FlexItem><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, border: '2px dashed var(--pf-v6-chart-color-green-300)', background: 'transparent', display: 'inline-block', boxSizing: 'border-box' }} /> Subscription threshold</span></FlexItem>
              </Flex>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

const SubscriptionUsageOpenShift: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false} id="primary-app-container">
    <Title headingLevel="h1" size="2xl">
      Subscription Usage - OpenShift
    </Title>
    <Content>
      <p style={{ marginTop: 8, color: '#6a6e73' }}>
        View OpenShift subscription usage details and related metering insights.
      </p>
    </Content>
  </PageSection>
);

const SubscriptionUsageAnsible: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false} id="primary-app-container">
    <Title headingLevel="h1" size="2xl">
      Subscription Usage - Ansible
    </Title>
    <Content>
      <p style={{ marginTop: 8, color: '#6a6e73' }}>
        View Ansible subscription usage details and related metering insights.
      </p>
    </Content>
  </PageSection>
);

export { SubscriptionUsageRHEL, SubscriptionUsageOpenShift, SubscriptionUsageAnsible };
