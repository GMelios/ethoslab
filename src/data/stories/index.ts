/** Research stories listed under Insights, newest first. Each renders with StoryPage. */
import type { Locale } from '../../i18n/config';
import type { Story } from '../../lib/story';
import { disabilityBenefitsStory } from './disability-benefits';
import { getMultipodStory } from './multipod';

export async function getStories(lang: Locale): Promise<Story[]> {
  return [await getMultipodStory(lang), disabilityBenefitsStory];
}
