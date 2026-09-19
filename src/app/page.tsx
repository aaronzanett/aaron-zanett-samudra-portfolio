import { SceneProgressProvider } from "@/lib/hooks/useSceneProgress";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SkipLink } from "@/components/ui/SkipLink";
import { SiteHeader } from "@/components/SiteHeader";
import { SceneOneIdea } from "@/components/scenes/SceneOneIdea";
import { SceneTwoMindset } from "@/components/scenes/SceneTwoMindset";
import { SceneProcessWork } from "@/components/scenes/SceneProcessWork";
import { ScenePlayground } from "@/components/scenes/ScenePlayground";
import { SceneEnd } from "@/components/scenes/SceneEnd";

export default function Home() {
  return (
    <SceneProgressProvider>
      <SmoothScrollProvider>
        <div className="bg-(--clay-300) p-(--page-inset)">
          <SkipLink />
          <div className="rounded-(--radius-page) bg-(--surface-page)">
            <SiteHeader />
            <main>
              <SceneOneIdea />
              <SceneTwoMindset />
              <SceneProcessWork />
              <ScenePlayground />
              <SceneEnd />
              <div id="work-index" />
            </main>
          </div>
        </div>
      </SmoothScrollProvider>
    </SceneProgressProvider>
  );
}
