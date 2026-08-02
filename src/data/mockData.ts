// mockData.ts — Seed / fallback cultural content (static fixtures).
// Responsibilities:
//   - FEATURED_REGALIA: sample royal regalia records (crowns, shields,
//     garments, jewelry, headwear) with full cultural metadata.
//   - ARTIFACTS: sample digital artifact records with reference numbers,
//     estimated ages, historical context and optional audio tracks.
//   - COMMUNITIES: sample ethnic-community records with population, language,
//     leadership, clan totems and key traditions.
//   - CULTURAL_NOTIFICATIONS: mock feed used by the notifications modal.
// NOTE: The public views actually read live data from Supabase via
// lib/useContent.ts. These fixtures are used as a reference dataset and as
// the source for the notifications modal — seed your database with this
// content (or use the Admin > Content Manager) so the site is populated.
import { RegaliaItem, ArtifactItem, CommunityItem } from '../types';

export const FEATURED_REGALIA: RegaliaItem[] = [
  {
    id: 'reg-omukama-crown',
    title: "Omukama's Crown",
    tribe: 'Batooro',
    category: 'Headwear',
    description: 'Circa 1890, symbol of sovereign authority and spiritual protection.',
    fullDetails: 'Handcrafted crown worn by the Omukama (King) of Tooro Kingdom during royal accession ceremonies. Adorned with intricate beadwork in royal gold, crimson, and ivory beads, passed down through sovereign generations.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU1V0R0EcgLw1sZnnZN8-x2NBcTA62n10uL-nOgNA5E5xt_p5vpMEvMgSNu63pOqcBfJO0N5dzSlbID1Co44K_Xrkf1o6idI4ZP4wRLIZxBvXsOePdtMiAOHeA9cLCgwyslL5qDB8VzPFA9fitXFkDLiQO5wMybsG4fWtkrSw0ECaE19R9jzo4C8vHZDAJnySMh7HBWoHj3A2QOVdBd7wthb9mTBdYZ-mF6b8LS9xdI6KxU-KIJRUaLg',
    era: '19th Century',
    material: 'Glass beads, leather, velvet, brass wire',
    originRegion: 'Tooro Kingdom, Western Uganda',
    spiritualSignificance: 'Embodies the divine ancestral seal of the Omukama, protecting the nation from misfortune.',
    isFeatured: true
  },
  {
    id: 'reg-warrior-shield',
    title: 'Warrior Shield',
    tribe: 'Acholi',
    category: 'Ceremonial',
    description: 'Intricate hide patterns representing kinship and battle honors.',
    fullDetails: 'Crafted from seasoned buffalo hide with hand-forged iron reinforcements and brass wire bindings. Used in traditional royal guard ceremonies and ceremonial dance rituals (Larakaraka).',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACKxHlWMB3LGLk5MiUPIa6G1-3B3LM8h7nqc49jeZaEC0WJGqyF3eq62wUbC6qPa_HAWBoB3Zdkj_fLh5TjyDawjZYEdPyEDGNvRsdV-8kSOUxXmsDOWJZYyRcH1FHofpeuXXtc3wl_b6iEUV24vJD7KjvNpW5lnxo5QpuY2mK79u-tSoZY5Se4rt2_-U8DUhMS07DtbZFoe1CHWE_jKKZZsdzPTgdYwC7uZrPsepp8DH7Sk4Wf84ovA',
    era: 'Circa 1900',
    material: 'Cattle hide, hand-forged iron, wooden spine',
    originRegion: 'Northern Region, Uganda',
    spiritualSignificance: 'Carries clan crest markings signifying courage, defense of homesteads, and ancestral guardianship.',
    isFeatured: true
  },
  {
    id: 'reg-brass-adornments',
    title: 'Brass Adornments',
    tribe: 'Ankole',
    category: 'Jewelry',
    description: 'Crafted symbols of wealth and social status from Western Uganda.',
    fullDetails: 'Heavy hand-poured brass bangles and neckpieces worn by noble Bahima women during weddings and royal gatherings. The shiny brass patina reflects sunlight across the pasture lands.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoDprzjAh9EW1VKS7A9QFNiFOR8HFMlrhu8NDxRHpFYVI_LbMx0HLZyTCdpojUD4ias3OL2HYmBviPzBzMAq8PBXyBuKPduu8eyWigK25I5TMCzvhv-bqso9rhITSljysUMPcQRyROvXCkyqQZFGNwpBdHWYE_jEJoP3rLEOON8T7Hkb5MJxc4YkX72J3UBlb311V-00-6XnCfTBseIweXMOq1WwDrgYYj8pRrgnIwYf7683lGiKEcgA',
    era: 'Late 19th Century',
    material: 'Poured brass, copper alloy, linen weave',
    originRegion: 'Ankole Kingdom, South-Western Uganda',
    spiritualSignificance: 'Bestows prosperity, blessing for herd fertility, and marital dignity.',
    isFeatured: true
  },
  {
    id: 'reg-traditional-gomesi',
    title: 'Traditional Gomesi',
    tribe: 'Buganda',
    category: 'Garments',
    description: 'A ceremonial silk garment known for its elegant square neckline and sash.',
    fullDetails: 'The floor-length attire with iconic puffed shoulders and broad silk sash (Ekitambala). Worn across Central Uganda for official royal visits, Kwanjula introduction ceremonies, and state celebrations.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuQ3mt3yKNbs8Ya41h0M-AY48rNc44B_u-qktGO6FnmQdgPs76jhgCLvlGxD9ts303xEvC_23sRpcTaA20USi1PEghwVNXfybebvwuaLITK-nJot505MbHpIZW8jBfUNZC56PK71bvkwkixfnGuLDKsr7mM5gjIM0DP4qCNUZfbOCzLSvZI1b3_rhh7NKEf0zgHvX8j5Jm3mLpViCd8e8EZsL0tsNVFm5zloLh9DFc9NMw66W1YT9MbQ',
    era: 'Early 20th Century to Present',
    material: 'Woven silk, satin, cotton lining',
    originRegion: 'Buganda Kingdom, Central Uganda',
    spiritualSignificance: 'Represents feminine grace, cultural fidelity, and royal etiquette.',
    isFeatured: false
  },
  {
    id: 'reg-enchoro-necklace',
    title: 'Enchoro Necklace',
    tribe: 'Maasai',
    category: 'Jewelry',
    description: 'Handcrafted glass beadwork representing age sets and social status.',
    fullDetails: 'Vibrant concentric beaded collar necklace woven with symbolic primary colors: red for bravery, blue for sky/rain, yellow for sun, and white for purity.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx_hv7JsZzHRljsjKbBkeSnA6f896iQDBzpOxt80SyDGhiCbtHwTRUUod_jTifmzKyMrIh3tkBw4yWO0Arq8SWi3ooCngdPxoCZmp4aWH9UHenEHlcHXmbEqNs0_MVXJJL6pxw0duwBDHYlTf72bsAYXcbpEFGifd4ivltQ3wTCahr0_7M3qiUz8sjJLfomNw3iDtq1I_6qA79k7VKdesv_U5MqhqUsm6UtZ5PZELwlvgzg59oRcFzlw',
    era: 'Mid 20th Century',
    material: 'Glass beads, sinew, recycled wire',
    originRegion: 'East African Rift Valley',
    spiritualSignificance: 'Identifies the wearer’s age grade, marital standing, and clan lineage.',
    isFeatured: false
  },
  {
    id: 'reg-ancestral-kanzu',
    title: 'Ancestral Kanzu',
    tribe: 'Central Africa',
    category: 'Garments',
    description: 'The cream-colored tunics of dignity, often paired with a blazer.',
    fullDetails: 'The iconic traditional tunic worn by men across Buganda, Busoga, and Tooro. Features meticulous maroon embroidery (Omulela) running along the neck and collar line.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB18hazl_T9BRQ79LnPcNDhfZkQjiIY-aDvIsjHawGnnILVkPPYk_dXlo7hLspK0OvRWaWHk4h2-laDhCbjNEvNermiKELHSB_gXXywT4MtaQ5XzZmwkuYkVyOkgHJ5Tx71BLJuHpGZTt72WtpXJxKggjsCM1oHR0wQOMxwngDWsGcZTkNqh9Ht7VtL01Dagof3LNOPdWPSU8_W3lkNtdVneyanUY5bdIkeXPPY9pFFVow_3bcMYC7twQ',
    era: '19th Century',
    material: 'Fine linen, silk thread embroidery',
    originRegion: 'Central Uganda & Great Lakes',
    spiritualSignificance: 'Symbol of male statesman honor, integrity, and elder wisdom.',
    isFeatured: false
  },
  {
    id: 'reg-noopile-hat',
    title: 'Noopile Hat',
    tribe: 'Fulani',
    category: 'Headwear',
    description: 'A conical woven straw hat adorned with dyed leather and geometric patterns.',
    fullDetails: 'Protective and ceremonial conical hat woven from wild grasses and bound with hand-dyed dark red and brown leather strips.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZkF4eeblK4ZE3VI6a-76D9gf8Q6-MqnlKgIQ0tFEh1nNZkUoKywen-BTdCSyjjFpOUgsPZumv9qUsK27yCxJHa_s5dtDcG6HMvCmE4HBiVAxNlt7UUga9-z29VPqebjXIR_SZOVGa3RXgkhXeoRKOc0_znnprn_KWFZaMlw2g1bo-pKgYLtksGvPslRYi7rBFmX-St0kDjnrPer8T9poWvLMyJj_DCLUkAxvCsSie7fYVnszBCpl_Yg',
    era: 'Circa 1920',
    material: 'Natural grass straw, tanned goatskin leather',
    originRegion: 'Sahel & Savanna Belt',
    spiritualSignificance: 'Protects pastoral travelers under intense solar heat while symbolizing nomadic freedom.',
    isFeatured: false
  },
  {
    id: 'reg-royal-kente',
    title: 'Royal Kente',
    tribe: 'Asante',
    category: 'Garments',
    description: 'Hand-woven strips of silk and cotton with symbolic geometric motifs.',
    fullDetails: 'Master weaver cloth using traditional narrow-strip looms. Each geometric grid pattern encodes proverbs, royal history, and philosophical concepts.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQADVp57HjA_KhXL6dxKKlgjZvh8evwWr1ymixFTo_AyVdWvJNT-t5nRHFkTpErQRHPrLNbMLfRIS3H5agpcR7rfS-Q5JedwpMLRIrrfa8WRsZQjpf5O2RLbN0HoDekcMqMT5TTgG5iDEFWb5S61LL2Xmp_aHpyYuCyDH0JShOjLeKG5gzjoIAjufzkdvfUoMgI0Cvp_I21oxjiGsMaFZQWMtZPeHb178AD4UoCOHZI2Tb28yD4jxBAQ',
    era: '18th Century Heritage',
    material: 'Pure silk thread, organic dyed cotton',
    originRegion: 'West African Coast',
    spiritualSignificance: 'Sacred garment reserved for paramount chiefs and life transition rituals.',
    isFeatured: false
  },
  {
    id: 'reg-agadez-cross',
    title: 'Agadez Cross',
    tribe: 'Tuareg',
    category: 'Jewelry',
    description: 'A silver talisman representing navigation and family lineage in the Sahara.',
    fullDetails: 'Lost-wax cast silver pendant incorporating the four cardinal directions and stellar constellation map points used by desert caravans.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0YEbMS3vISYWHDhMg34vcutRROESXbg_njX6x-NV6uHlawIWJhaJYJb-n-B-7WLMus1nZFxSx1lZNTtydlz6UXd6Gd2r7jFGD7TOn8njR-uYU8r9lTNqFb8tTcR1kR3xD53HjgiI8_huZ78QzL6FC1l4LlglfTNzN6pIMwnQ9fOG-EGBmnaK_xevvdbxMPbzWS3OsOIFBKPT5JVuRpr6xtEcMGZxQX6FPiAdC2_PSvqwQ9GPA_i4aAw',
    era: '19th Century',
    material: 'Hand-chased pure silver, indigo linen thread',
    originRegion: 'Saharan Highlands',
    spiritualSignificance: 'Protective amulet passed from father to son upon reaching manhood.',
    isFeatured: false
  },
  {
    id: 'reg-isicholo-headdress',
    title: 'Isicholo Headdress',
    tribe: 'Zulu',
    category: 'Headwear',
    description: 'A traditional flared hat representing maturity and social status.',
    fullDetails: 'Woven flared crown colored with natural red ochre pigments and structural woven grass. Worn exclusively by married women during ceremonial dances.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3MgOXVnjN-7n8fUSMKiOj7H3c_K704qnsqSDzm0z_PUfkUIZlvI_mvSO9gh9E9dCw1aq0eFvkBszboI7ddXngSKNOVoH9TyibkKKpAoRoYLNv2AgBx9kgs2Ec1QgPkQoJaRBDh3ljT5LZNvG5A7Af6bYDg7TqWF82lePWyTEjVv_qfogd-OkarRgHmg9tgCVQTqksHWcMfHTLp5clOaQFH-nvw8LvYtYiBYaeYef1PKQKPaypAUsI8w',
    era: 'Early 20th Century',
    material: 'Wild grass weave, red ochre pigment, cotton thread',
    originRegion: 'Southern Africa',
    spiritualSignificance: 'Demonstrates dignity, matronly wisdom, and commitment to hearth and family.',
    isFeatured: false
  },
  {
    id: 'reg-ceremonial-beads',
    title: 'Ceremonial Beads',
    tribe: 'Acholi',
    category: 'Jewelry',
    description: 'Sacred ornamentation worn during cultural rites of passage.',
    fullDetails: 'Multi-stranded waist and neck beads crafted from carved bone, seeds, and semi-precious stone beads worn during harvest thanksgiving festivals.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDMl-QoG1jHezoSYJ7rnKgRNtBO31TnXID9tG-tsPZLxZ7y5_cRmz8Co23d9_tNPobgMhczjqR8jZADVVZAc8EOfF1Uy5Hf_dGC0EnU46aJsKamWiV_DZ1Lge6D-X3SCpzISZyr4H0b3NiX12jwYwGioXwPoQMmOkwrT5qOc-R-ieXUpXQG-gjkzKj3tmvZdIX6p04uUknoFz2pixph4QNER140_c5DQ9HerTHrSOy-qjLNe9ySNOURA',
    era: '19th Century',
    material: 'Natural bone, polished seeds, stone, cowrie shells',
    originRegion: 'Northern Uganda',
    spiritualSignificance: 'Anchors youth to ancestral guidance during coming-of-age ceremonies.',
    isFeatured: false
  }
];

export const ARTIFACTS: ArtifactItem[] = [
  {
    id: 'art-talking-drums',
    title: 'Royal Talking Drums (Atumpan)',
    culture: 'Akan Heritage',
    refNumber: '#NT-2042',
    estimatedAge: 'Late 18th Century',
    location: 'Central Region, Ghana',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuquU3ZFYnlBJiYIKUOW7gwG0EcIGKPleknvsKPQQy_RzaXygcKA7rl8ohs3MeXpkgI-Fvw7uEvZYv2D5niGGaHjQpLzrV_YSjDrhvSae72pyn1YEYBOR8EuRITxYoOVjTYgM7kZf6XAYvcA7a8_ACxts9zg6PHJULE-fLJi7dJbGxvWsasCy4mNm7gezGic1kGuqFPuZTtVvZg1QvWDYWmKcpeXlZXZwzR64K5-bZttTxem0mkiBW8g',
    description: 'Master pair of open goblet drums carved from a single hollowed log of Tweneboa wood, tuned with elephant hide and peg tensioners.',
    material: 'Polished hardwood, stretched hide, brass pegs, copper wire',
    addedTime: 'ADDED 3 DAYS AGO',
    significanceDetails: 'The Atumpan is the chief instrument for transmitting drum poetry, historical chronicles, and royal announcements across distances.',
    historicalContext: 'Played exclusively by master drummers (Kyerema) who were custodians of oral history and royal genealogies.',
    audioTrack: 'talking_drums'
  },
  {
    id: 'art-vanguard-spears',
    title: 'Ancestral Vanguard Spears',
    culture: 'Kongo Kingdom',
    refNumber: '#NT-1088',
    estimatedAge: 'Circa 1650 AD',
    location: 'Lower Congo River Basin',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWPTnwWRgrx3YfTkcX0xI2JUEvSmbiB6LkxZLBxUeFEIktvOmGKWAOy_0-Q3i5vYxeHXpWG2ITzVPSYJDAztCwmc2faAxbZorhWBzEUqbEdVcN9j9JgnheCFwg6Yj0XQGdvW_HkHyqKSSn5qGF63_e-tZjJZUrty6kTQUwE25pihjjNouGVKO8MulGMHb_iUx_88j7y8kGujpxZ94p7R2NtsaBsx4dM6B4dggm3kp4dRHzHZTGEXsGUA',
    description: 'Forged iron spearheads with copper filigree spiral wraps along the shaft, preserved in court arsenals for ceremonial state marches.',
    material: 'Hand-forged iron, copper wire, African mahogany wood',
    addedTime: 'ADDED 4 DAYS AGO',
    significanceDetails: 'Emblematic of royal security, territorial sovereignty, and physical defense of clan boundaries.',
    historicalContext: 'Dating back to the height of the Kongo Kingdom, representing military discipline and blacksmithing mastery.'
  },
  {
    id: 'art-terracotta-figure',
    title: 'Terracotta Scholar Figure',
    culture: 'Nok Culture',
    refNumber: '#NT-0042',
    estimatedAge: '500 BCE - 200 BCE',
    location: 'Kaduna State, Nigeria',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK3NEGPCvDboXHozJYRPrYXg6Q01cszAn2T4evzKYpvTgybCf7jQ8am-xrNmyt_VY5kwzTuxa8QU4hMoNqavhK2FBxK4Zsqt5PVjKQ8n6TMPFiuTFJiNz2avFcOE4MtVaOXu1qEEwzvD4wFqxNAscocz6niqhENQ2UGXibhSW8wuolVGQTqFiX98LCYXLUHESst9kdsXHu7nz8LNIiZKvpIgwztGBqsyDCgN4nGKbBfcSJ2u4DYdQR4g',
    description: 'Ancient hollow terracotta head featuring characteristic oval eyes, pierced pupils, and highly elaborate braided coiffure.',
    material: 'High-fired iron-bearing clay, natural ochre slip',
    addedTime: 'ADDED 1 WEEK AGO',
    significanceDetails: 'One of the earliest known sculptural traditions in Sub-Saharan Africa, testifying to sophisticated early iron-age urban centers.',
    historicalContext: 'Uncovered during tin mining operations in Nok village, revealing sophisticated terracotta kiln firing techniques.'
  },
  {
    id: 'art-golden-rhino',
    title: 'Golden Rhinoceros Ornament',
    culture: 'Great Zimbabwe Era',
    refNumber: '#NT-9003',
    estimatedAge: '13th Century',
    location: 'Limpopo Valley, South Africa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5PnVhf5suoTHCBxJWp6KXiAc8yj1_k2yLzRAlo5tkClg8onkvxKSESJLqfoJJC9IARrnfgNgWMA_3bRKgOBz6MSwgmbPMIxPPSIpNQ1iMd3iRN_kplj3HKlwq7quJ6EbY4puUfz4v90V8ZpDBLJ8_ga8JeiS_AmN0lFIcNYPoKHKv7vmqSYsluHzbLngbb453UdAXqboWGHAmvW_xuB7Fd5rw--HlixkDssx_BMSPTNJVeyS8FfBl6A',
    description: 'Foil-hammered pure gold sheet wrapped over a carved wooden rhinoceros core with delicate gold tack fasteners.',
    material: 'Hammered gold foil, carved hardwood core, gold tacks',
    addedTime: 'ADDED 2 WEEKS AGO',
    significanceDetails: 'Symbol of monarchical power, solitary strength, and extensive trans-Indian Ocean gold trade routes.',
    historicalContext: 'Discovered at the royal burial site of Mapungubwe Hill, highlighting southern Africa’s rich medieval gold civilization.'
  },
  {
    id: 'art-mbugu-tapestry',
    title: 'Mbugu Tapestry',
    culture: 'Baganda Heritage',
    refNumber: '#NT-3011',
    estimatedAge: 'Circa 1910',
    location: 'Central Uganda',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAueui5xZKaxJBJzp_Mp0MLFgmK51LdPf9U7mf3bUGOpxlfb7knWdFTPu1hyYb3A-_jfXXni0w_PkzS7DcWKnh0wogk8tLuJWnG50d_GZQDcbTQ4DkoKmgfB-UU5mHBpLjyB3W-ggAx65z0ZVMuLhzGi8hnwH9AyOsVnyo0aGgfgvatdhrzwsjwwWOqF0PkotSKyuT9-xNip66Z5HDhobHQOR_BnEwvLEK-tXu76nLVubwMzhmU4AK-Uw',
    description: 'Ritual barkcloth harvested from Mutuba trees (Ficus natalensis) and decorated with hand-stenciled organic charcoal patterns.',
    material: 'Hammered tree bark, natural charcoal & earth pigments',
    addedTime: 'ADDED 2 DAYS AGO',
    significanceDetails: 'Recognized by UNESCO as a Masterpiece of the Oral and Intangible Heritage of Humanity.',
    historicalContext: 'Barkcloth making in Buganda is an ancient craft performed by hereditary royal artisans of the Ngonge clan.'
  },
  {
    id: 'art-communal-libation-bowl',
    title: 'Communal Libation Bowl',
    culture: 'Bakiga / Kigezi',
    refNumber: '#NT-4105',
    estimatedAge: 'Late 19th Century',
    location: 'Kigezi Highlands, South-Western Uganda',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5AhtRpfyE6OQpb2-ApuXgxWG89UtOZ3hBR_BPRvxzvlmpXwXx49MoUKGVr7G9hY8nZ3T5VYt-fpBSnWzFP_s-sKH3x0sFZGkyS6QVDrIL916kae1-k2En_24TWZPD035eXLmZKfGwlGCKnnrv58FGsJTyJszNZjHNVYMJWdyMQPq5x_x_OWTGwOjKLlpC3Zc14AsYuyshbCEH2CJopRxJblGxTnU2LyCGanL1Yt9SlmNgpPRbP2Te5A',
    description: 'Hand-carved hardwood vessel from Kigezi used for pouring ancestral libations and communal sorghum beer share rites.',
    material: 'Carved African mahogany, beeswax seal',
    addedTime: 'ADDED 5 DAYS AGO',
    significanceDetails: 'Used during harvesting rites to pour the first drop of millet wine onto the earth in honor of clan elders.',
    historicalContext: 'Symbolizes communal unity, dispute resolution, and spiritual communion among highland clans.'
  },
  {
    id: 'art-royal-ennanga',
    title: 'Royal Ennanga',
    culture: 'Buganda Kingdom',
    refNumber: '#NT-5080',
    estimatedAge: '19th Century',
    location: 'Court of Mutesa I, Kampala',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsPYlKZhtxTcVs6_VlJViM7SZYdQvKQgcCCH9clzxoKx_HF1CTDgOyyYiwYFqfPWWQAesmq8C-DmF2__2PwH5u30tlYTGpfbhYahCW3MlKEam54UtayUcJSORW3DAIARZciHN1W9c-iQvEPmNQWWkg1A7n9EuESdF481JlPNxE0oEt9T3rU5oRKLGw3lroJq3aviDgVzbSh8i3cZuESpGYprWc7_lRx6Ux6sIWV4E-I01Q4mfxRj1XUQ',
    description: '8-stringed royal harp curved from wood and resonant monitor lizard hide membrane, tuned to an pentatonic scale.',
    material: 'Resonant hardwood, monitor lizard skin, twisted fibre strings',
    addedTime: 'ADDED 1 WEEK AGO',
    significanceDetails: 'Played by court musicians to recount royal epics, heroic deeds of Kabakas, and moral allegories.',
    historicalContext: 'Restored instrument from the private collection of Kabaka Mutesa I of Buganda.',
    audioTrack: 'ennanga_harp'
  }
];

export const COMMUNITIES: CommunityItem[] = [
  {
    id: 'com-baganda',
    name: 'Baganda',
    region: 'Central Region',
    description: 'The largest ethnic group in Uganda, the Baganda belong to the Bantu-speaking people with a highly organized social and political system centered around the Kabaka (King). They are known for their deep-rooted traditions in barkcloth making, coffee farming, and vibrant oral literature.',
    fullHistory: 'The Kingdom of Buganda was founded in the 14th century by Kintu, the first Kabaka. Centered around the fertile shores of Lake Victoria, Buganda developed a sophisticated central administration, a naval fleet of war canoes, and a intricate clan system (Obwakabaka Bwa Buganda). Each clan maintains a specific hereditary role in the service of the Kabaka.',
    avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiNYokRgq7b9Col4s_Fxk5K7D0nVQQ0DxfQ8hAEd6di69U2TU1iWXDySDvVuyJGoSfnzR1anN6XBqMXfhIq78k77F6PirKwEALBgLPSc6CCQxJnQhXaKTS7Ul3YiW4E4Y2RUjHMb1rqcHrnBRJ3Wp13zAVAOX_rjRaAc5W2yWroa7F5sn-EB9XKcW22RYlt0suRSKiyIh0rhy3onCe6KB96JwVpPhOwMrawC0poXXAd700OusQL8THSg',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbT5D5jXTv5V0NWNdHI8okG9Ap23F9ZeaZvyXkQQzvu0Ugi6tIZRnerf25LPYdLAdVBL_TyWXswXwXNfZpvO37LCFsURK_ccIams951-IVN6eCAn8OEreIMpeAMTQVuBtZEozKuDfMIWyHxeXtc05V5obWpcxWZVf9va6n7zVzOgXySCJ57NdAjyZ_jHgTaCnk8kxl2K47scwpbDYLdMpAz_J0bcGWeuGqAaoAfuRm74ScWbZtWp7VkQ',
    population: '7.5+ Million',
    language: 'Luganda',
    royaltyLeader: 'His Majesty Kabaka Ronald Muwenda Mutebi II',
    totems: [
      { name: 'Pangolin', lugandaName: 'Lugave', meaning: 'Protector of hidden wisdom', symbol: '🦎', description: 'The prime clan responsible for royal architectural carpentry.' },
      { name: 'Sheep', lugandaName: 'Ndiga', meaning: 'Gentleness and peace', symbol: '🐑', description: 'Custodians of royal barkcloth crafting.' },
      { name: 'Ant', lugandaName: 'Kinyomo', meaning: 'Industrious collective strength', symbol: '🐜', description: 'Master builders and agricultural planners.' },
      { name: 'Lion', lugandaName: 'Mpologoma', meaning: 'Sovereign courage', symbol: '🦁', description: 'Guardians of royal military defense.' }
    ],
    keyTraditions: ['Barkcloth Harvesting (Olubugo)', 'Bakisimba Court Dance', 'Introduction Ceremony (Kwanjula)', 'Royal Drums (Mujaguzo)']
  },
  {
    id: 'com-karamojong',
    name: 'Karamojong',
    region: 'North Eastern Region',
    description: 'A Nilotic ethnic group of nomadic agro-pastoralists living in the semi-arid Karamoja region. Their culture is centered around cattle, which represent wealth and status. Known for their intricate beadwork, traditional manyattas (homesteads), and the famous "Ekizino" jumping dance.',
    fullHistory: 'Originating from the Ateker cluster that migrated from the Ethiopian highlands in the 16th century, the Karamojong survived harsh climate conditions through nomadic cattle herding. Their social organization is governed by the Akiriket council of elders.',
    avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg_XybGJ5cKK1WKdeZ5t7MnZVmbZEijn-DKoXvsHGroSP_YEHaexfDBa63Yi4NTas_8Pw-vGeyP2S64v-dqcxwX1p1RJXr0UTA98M7qJeyQ08G3PRXiXMf_v6iCkCgXEIzk9ukAxDRO-0JyNnpqr9EeMgeJ1ZNazSSeiZV1zZxP7aPrIJ0frTCYRPZ_k8uovmKZx1XaUgA3rBMynlLmBoyGXFZlAON8AJPzNkOBz6AQkCfGaiKFkdvlA',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAERayqixLoyoO_cXP_lHnW1dWrQ1kt2zruMeNQm78Czv1qpJJHsdNh_92Dk48Zmby5xuvJiR3p_FPJMgQhcfS781SPxDviRGneros6lS9j3KA1b7TjYTUDT85khJfMNLg4P7dwDq8yagg4FKMK6BkIvggS9WluZYeAZsMIx5QKmbDcty41EO-exrrdI_2leI0UNus13lh4m2IUS9PckrXhT_AA9JvKopze7njxYRBazquNmYqJ0s6lDg',
    population: '1.2 Million',
    language: 'Nkaramojong',
    royaltyLeader: 'Council of Elders (Akiriket)',
    totems: [
      { name: 'Ostrich', meaning: 'Speed and vigilant sight', symbol: '🦩', description: 'Associated with swift messengers.' },
      { name: 'Leopard', meaning: 'Silent bravery in wilderness', symbol: '🐆', description: 'Associated with elite warrior bands.' }
    ],
    keyTraditions: ['Ekizino High Jump Dance', 'Manyatta Homestead Building', 'Age-Set Initiation (Asapan)', 'Beaded Shuka Weaving']
  },
  {
    id: 'com-banyankole',
    name: 'Banyankole',
    region: 'Western Region',
    description: 'Inhabitants of the former Nkore kingdom, the Banyankole are divided into two groups: the pastoralist Bahima and the agriculturalist Bairu. They are world-renowned for the Ankole Long-horned cattle and their complex poetic recitations known as \'Ekyevugo\'.',
    fullHistory: 'The Nkore Kingdom flourished in South-Western Uganda for centuries, built on pastoral economy and agricultural abundance. The Bahima pastoralists developed poetic arts celebrating the elegance of Ankole cattle, while Bairu agriculturalists cultivated rich banana plantations and ironcraft.',
    avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFf8fB9tZeVD0dY2pku9AJn5IHl_hbYpzhqQnnU6Agf4v3R6FtlQ58-OUmyu5nc3TQhWUPHP9Yl_4bymGdlu1xO0HX0aMfvx2xSm7vQ9X2EVi0KL_yPS0eweEbWKPiqGk6tAsEef5oyPJFwQ2uhJ2gJKz7cRGtW0hEYZkcxGgNF7WrUrGZhi2zh-KNKUMF77rds6U8Nzt_gks0wV4aDSCQdwo_pkBK4Mf_Ma56aqGaPM8mElkEeP4L-Q',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtIgTMI38ld5oBEqMDpIMJN16Gyy53FWWcxhEcJEE4XijFsj8X5hdrx3d-JU0JyndfVLDKkB9qKD1frUJDWRtRxlqw1ZW0HqeNRZ3IKu167H9oWWNW49oQ8YtGgt8VmYjrx0f0UrtdZD3NSgkDLNJCCUjFAQa5A39BPkSmPsuY-ZWIXpVZUYoxSsAqTVm4Pk19IJV4XlSAGWUYE1itvEDruW2rDRjSXxZRltC-zDeMFSB1a0v-2fPv1g',
    population: '3.2 Million',
    language: 'Runyankole',
    royaltyLeader: 'Omugabe of Nkore Heritage Council',
    totems: [
      { name: 'Cattle', meaning: 'Life, sustenance, and beauty', symbol: '🐂', description: 'Sacred veneration of Inyambo cattle.' },
      { name: 'Crested Crane', meaning: 'Grace and regal elegance', symbol: '🦩', description: 'Symbol of peace across Western pastures.' }
    ],
    keyTraditions: ['Ekyevugo Heroic Poetry', 'Kitaguriro Dance', 'Ekitambala Marriage Wraps', 'Ankole Cattle Sanctification']
  },
  {
    id: 'com-basoga',
    name: 'Basoga',
    region: 'Eastern Region',
    description: 'Hailing from the Busoga sub-region between Lake Victoria and Lake Kyoga, the Basoga are a Bantu-speaking group with a rich monarchical history led by the Kyabazinga. They are masters of the \'Bigwala\' gourd trumpet music, recognized by UNESCO as intangible heritage.',
    fullHistory: 'Busoga comprises 11 traditional chiefdoms unified under the ObwaKyabazinga Bwa Busoga. Located at the source of the River Nile in Jinja, Busoga culture is renowned for royal xylophone (Amadinda) music, Bigwala trumpet processions, and riverine spirituality.',
    avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcyXgsr5md6TMl7gqqu1C6EMFV937WLE95URq9Ht7yUPuRWGjqYkkfy_oplAeoMjNJviVYdaSmB3mO4Tgdixa5FBjeshutlhPnhNnMutpt59UNFCLETnrY2rmE2h-ELXxiLQCwgWZ7Yi1vRHn9xrz3LJJABJeADFBHW1e29qHqvI9uuu025-OUrhBjLI9RmDmgLHJnMdPHFN_vUl3SPY-4RtzFR9rNL3ZgJOyadW-P88_4l-9aSFSayQ',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwUMfmfZOokiicxhyVGgO_s-AJ-TJNXXcWam7ZcT6aYOkOHb_67bEm4ZBrMjI5eQ7p0d1MpkG1T1d1wxCQ9NCHjePkF5bH4DIG10_AUW2C6eCCrW7l7QYJ0lJQlhovLMiQ0qtkIJYbjsP6pWxmiA8G1fT7xjQ9B1rmtXv0NZSIJQjfKmSgTJ5aSWMJ8fWYlsfRG0RCC_dDy9b1Nd04r-cYLAU2vZ3jVHR8vxHTmRnncgVq_QgF6R2kdg',
    population: '3.8 Million',
    language: 'Lusoga',
    royaltyLeader: 'His Royal Highness Isebantu Kyabazinga William Gabula Nadiope IV',
    totems: [
      { name: 'Fish', meaning: 'Abundance of River Nile', symbol: '🐟', description: 'Guardians of river waterways and fishing lore.' },
      { name: 'Otter', meaning: 'Agility and playfulness', symbol: '🦦', description: 'Associated with royal boatmen.' }
    ],
    keyTraditions: ['Bigwala Gourd Trumpet Orchestras', 'Nalufuka Dance', 'Jinja River Nile Blessings', 'Amadinda Giant Xylophone']
  },
  {
    id: 'com-lugbara',
    name: 'Lugbara',
    region: 'North Western Region',
    description: 'A Central Sudanic ethnic group residing in West Nile (Arua, Maracha, Yumbe). Famous for their ancestor veneration structures (Ori), iron smelting heritage, and traditional harvest gastronomy like Otobi and Osu.',
    fullHistory: 'The Lugbara migrated from the South Sudan region centuries ago and settled in the fertile green highlands of West Nile. They maintained a decentralized democracy led by clan chiefs (Opi) and ritual rainmakers (Ezo).',
    avatarImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb34Fwj53nyQaZJ-v1J0Eo-scDXvRdZhb6FdcY0WVReaxK5RJPQzlVHKe0oe3f0X2AJ9jp2-aZxcF-lao1QVXOfqKzFe0M99w6NUDFgw3yRNTdQAJtPoEhAPkOcPlwILKzF5q3SmIBMJYZZCjv5PycJlmtYPWGU5wNIZMvHBlkvI6rnlECRg0wjlY0W08ZjpWaokx-4MigN9OQhgmtNWs04LrpYYcEMqramhLUbttiY4mvhzVCRmdyOQ',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb34Fwj53nyQaZJ-v1J0Eo-scDXvRdZhb6FdcY0WVReaxK5RJPQzlVHKe0oe3f0X2AJ9jp2-aZxcF-lao1QVXOfqKzFe0M99w6NUDFgw3yRNTdQAJtPoEhAPkOcPlwILKzF5q3SmIBMJYZZCjv5PycJlmtYPWGU5wNIZMvHBlkvI6rnlECRg0wjlY0W08ZjpWaokx-4MigN9OQhgmtNWs04LrpYYcEMqramhLUbttiY4mvhzVCRmdyOQ',
    population: '1.8 Million',
    language: 'Lugbarati',
    royaltyLeader: 'Agofe (Paramount Cultural Leader)',
    totems: [
      { name: 'Guineafowl', meaning: 'Vigilance and community flocking', symbol: '🦤', description: 'Symbol of peaceful coexistence.' }
    ],
    keyTraditions: ['Agwara Horn Dance', 'Ori Ancestor Shrine Rituals', 'Simsim & Honey Culinary Preservation']
  }
];

export const CULTURAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'New Artifact Archived',
    message: 'Mbugu Tapestry ritual barkcloth from Buganda Kingdom added to Digital Repository.',
    time: '2 hours ago',
    category: 'Archive Update'
  },
  {
    id: 'n2',
    title: 'Ethical Preservation Notice',
    message: 'Read our updated Community Guidelines on sacred artifact digitalization.',
    time: '1 day ago',
    category: 'Ethics'
  },
  {
    id: 'n3',
    title: 'Oral History Audio Added',
    message: 'Listen to the 8-stringed Royal Ennanga harp audio recording from court archives.',
    time: '3 days ago',
    category: 'Audio'
  }
];
