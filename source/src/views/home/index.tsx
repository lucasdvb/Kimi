import { homeContent } from "@/data/mocks/home";
import { RobotProvider, RobotView } from "@/components/common/robot-view";

import { SectionStack, StackLayer } from "@/views/home/section-stack";
import { Hero } from "@/views/home/sections/hero";
import { Season } from "@/views/home/sections/season";
import { Footer } from "@/views/home/sections/footer";
import { Paddock } from "@/views/home/sections/paddock";
import { Timeline } from "@/views/home/sections/timeline";

/**
 * Home view — Server Component. The hero effect, "the season so far", then
 * the career timeline, the paddock report, then the sign-off.
 * The bot check happens here (server) so crawlers get the poster and never
 * fetch the three.js chunk.
 *
 * The first three blocks are a **stack**: each pins at the top of the viewport
 * and the next one comes out over it, the covered one receding rather than
 * scrolling away. See `section-stack.tsx`. The timeline is the last layer, so
 * it covers but is never covered, and the page returns to ordinary flow under
 * it — the paddock and the footer follow it normally.
 */
interface HomeViewProps {
  /**
   * The robot form (D-016), reached through the proxy's rewrite of `/`.
   * Deciding it here instead of with `await isBot()` keeps `/` static — reading
   * the request headers made the route dynamic for every visitor.
   */
  robot?: boolean;
}

export const HomeView = ({ robot = false }: HomeViewProps) => {
  const bot = robot;

  return (
    <RobotProvider robot={robot}>
      {robot && <RobotView />}
      <main>
        <SectionStack>
          <StackLayer z={0}>
            <Hero content={homeContent.hero} showScene={!bot} />
          </StackLayer>
          <StackLayer z={10}>
            <Season content={homeContent.season} />
          </StackLayer>
          <StackLayer z={20} pinned={false}>
            <Timeline content={homeContent.timeline} />
          </StackLayer>
        </SectionStack>
        <Paddock content={homeContent.paddock} />
        <Footer content={homeContent.footer} />
      </main>
    </RobotProvider>
  );
};
