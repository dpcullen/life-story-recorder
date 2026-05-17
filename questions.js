const THEMES = [
    {
        id: "childhood",
        title: "Childhood & Growing Up",
        icon: "🧒",
        description: "Stories from your earliest days and the world you grew up in.",
        questions: [
            { id: "birth", text: "Where and when were you born? What do you know about the day you arrived?" },
            { id: "earliest_memory", text: "What is your earliest memory?" },
            { id: "childhood_home", text: "Describe the home you grew up in. What did it look like, smell like, feel like?" },
            { id: "neighborhood", text: "What was your neighborhood like? Who were your neighbors?" },
            { id: "childhood_friends", text: "Who were your closest childhood friends? What did you do together?" },
            { id: "favorite_games", text: "What games did you play as a child? What were your favorite toys?" },
            { id: "school_memories", text: "What do you remember about school? Did you have a favorite teacher?" },
            { id: "childhood_trouble", text: "Did you ever get into trouble as a kid? What happened?" },
            { id: "childhood_fears", text: "What were you afraid of as a child?" },
            { id: "happiest_childhood", text: "What is your happiest childhood memory?" }
        ]
    },
    {
        id: "family_origins",
        title: "Family & Heritage",
        icon: "🌳",
        description: "Your family tree, traditions, and where you come from.",
        questions: [
            { id: "parents_names", text: "What were your parents' full names? Where were they from?" },
            { id: "parents_story", text: "What do you know about how your parents met?" },
            { id: "parents_personalities", text: "How would you describe your mother's personality? Your father's?" },
            { id: "siblings", text: "Tell me about your brothers and sisters. What was your relationship like?" },
            { id: "grandparents", text: "What do you remember about your grandparents?" },
            { id: "family_traditions", text: "What traditions did your family have? Holidays, meals, gatherings?" },
            { id: "family_saying", text: "Did your family have any sayings, expressions, or inside jokes?" },
            { id: "heritage", text: "What do you know about your family's heritage or where your ancestors came from?" },
            { id: "family_recipes", text: "Are there any family recipes that have been passed down? What are they?" },
            { id: "family_lessons", text: "What is the most important thing your parents taught you?" }
        ]
    },
    {
        id: "teenage_years",
        title: "Teenage Years",
        icon: "🎸",
        description: "Coming of age — your teenage adventures and discoveries.",
        questions: [
            { id: "teen_personality", text: "What kind of teenager were you? Quiet, rebellious, studious, social?" },
            { id: "high_school", text: "What was high school like for you? What did you enjoy or struggle with?" },
            { id: "teen_friends", text: "Who were your best friends as a teenager? Are you still in touch?" },
            { id: "first_job", text: "What was your first job? How much did you earn?" },
            { id: "teen_music", text: "What music did you listen to? Did you go to any concerts?" },
            { id: "teen_fashion", text: "What did you wear? What was the style back then?" },
            { id: "teen_crush", text: "Did you have a first crush or first date? What happened?" },
            { id: "teen_car", text: "Did you learn to drive? What was your first car?" },
            { id: "teen_dream", text: "What did you dream of becoming when you grew up?" },
            { id: "teen_lesson", text: "What's something important that happened to you as a teenager that shaped who you became?" }
        ]
    },
    {
        id: "love_marriage",
        title: "Love & Marriage",
        icon: "💕",
        description: "How you found love and built a life together.",
        questions: [
            { id: "how_met", text: "How did you and your spouse meet? What were your first impressions?" },
            { id: "first_date", text: "What was your first date like? Where did you go?" },
            { id: "falling_in_love", text: "When did you know you were in love? Was there a specific moment?" },
            { id: "proposal", text: "How did the proposal happen? Tell me every detail." },
            { id: "wedding_day", text: "Describe your wedding day. What do you remember most?" },
            { id: "early_marriage", text: "What were the early days of your marriage like? Where did you live?" },
            { id: "marriage_challenges", text: "What has been the hardest part of marriage? How did you get through tough times?" },
            { id: "marriage_joy", text: "What has brought you the most joy in your marriage?" },
            { id: "relationship_advice", text: "What advice would you give about love and relationships?" },
            { id: "love_letter", text: "If you could write a short love note to your spouse, what would it say?" }
        ]
    },
    {
        id: "parenthood",
        title: "Becoming a Parent",
        icon: "👶",
        description: "The journey of raising your children.",
        questions: [
            { id: "becoming_parent", text: "How did you feel when you found out you were going to be a parent?" },
            { id: "child_birth", text: "What do you remember about the day your first child was born?" },
            { id: "baby_memories", text: "What were your children like as babies? Any funny stories?" },
            { id: "parenting_style", text: "How would you describe your parenting style? Was it different from your own parents?" },
            { id: "proud_moments", text: "What moments as a parent have made you most proud?" },
            { id: "parenting_hard", text: "What was the hardest part of being a parent?" },
            { id: "family_vacations", text: "What were family vacations like? Any memorable trips?" },
            { id: "daily_routines", text: "What did a typical day look like when your kids were young?" },
            { id: "child_personalities", text: "How would you describe each of your children's personalities growing up?" },
            { id: "parent_wisdom", text: "What do you wish you had known before becoming a parent?" }
        ]
    },
    {
        id: "career",
        title: "Work & Career",
        icon: "💼",
        description: "Your professional life and what you built.",
        questions: [
            { id: "career_path", text: "How did you end up in your career? Was it planned or did it just happen?" },
            { id: "favorite_job", text: "What was your favorite job and why?" },
            { id: "work_proud", text: "What accomplishment in your career are you most proud of?" },
            { id: "work_people", text: "Who were the most memorable people you worked with?" },
            { id: "work_hard", text: "What was the most difficult time in your working life?" },
            { id: "boss_mentor", text: "Did you have a boss or mentor who really influenced you?" },
            { id: "work_funny", text: "What's a funny story from work?" },
            { id: "work_lessons", text: "What did your career teach you about life?" },
            { id: "retirement", text: "How do you feel about retirement? What do you miss or not miss?" },
            { id: "career_advice", text: "What career advice would you give to younger generations?" }
        ]
    },
    {
        id: "life_experiences",
        title: "Life Experiences",
        icon: "🌍",
        description: "Adventures, milestones, and the moments that defined you.",
        questions: [
            { id: "proudest_moment", text: "What is the proudest moment of your life?" },
            { id: "biggest_challenge", text: "What is the biggest challenge you've faced? How did you overcome it?" },
            { id: "travel", text: "What is the most memorable place you've ever visited?" },
            { id: "historical_events", text: "What major historical events do you remember living through? How did they affect you?" },
            { id: "surprise", text: "What's something that happened in your life that you never expected?" },
            { id: "friendship", text: "Tell me about your closest friendships over the years." },
            { id: "hobby", text: "What hobbies or interests have brought you the most joy?" },
            { id: "home_story", text: "Tell me about the different homes you've lived in. Which was your favorite?" },
            { id: "turning_point", text: "Was there a turning point or defining moment in your life?" },
            { id: "adventure", text: "What's the most adventurous thing you've ever done?" }
        ]
    },
    {
        id: "beliefs_values",
        title: "Beliefs & Values",
        icon: "✨",
        description: "What you believe in and what matters most to you.",
        questions: [
            { id: "values", text: "What values are most important to you? Where did they come from?" },
            { id: "faith", text: "What role has faith or spirituality played in your life?" },
            { id: "life_philosophy", text: "What is your philosophy on life? How do you try to live?" },
            { id: "happiness", text: "What makes you truly happy?" },
            { id: "gratitude", text: "What are you most grateful for in your life?" },
            { id: "regrets", text: "Is there anything you wish you had done differently?" },
            { id: "forgiveness", text: "Has there been a time when forgiveness was important in your life?" },
            { id: "strength", text: "Where do you find strength during hard times?" },
            { id: "changed_mind", text: "Have your beliefs or views changed over the years? How?" },
            { id: "meaning", text: "What gives your life the most meaning?" }
        ]
    },
    {
        id: "wisdom_legacy",
        title: "Wisdom & Legacy",
        icon: "📜",
        description: "The lessons you want to pass on to future generations.",
        questions: [
            { id: "life_lessons", text: "What are the most important lessons life has taught you?" },
            { id: "advice_grandchild", text: "What advice would you give to your grandchildren as they grow up?" },
            { id: "younger_self", text: "If you could go back and tell your younger self one thing, what would it be?" },
            { id: "world_change", text: "How has the world changed most during your lifetime?" },
            { id: "simple_pleasures", text: "What are the simple pleasures in life that you treasure?" },
            { id: "legacy", text: "How do you want to be remembered?" },
            { id: "family_message", text: "Is there anything you've never said to your family that you'd like to say now?" },
            { id: "life_motto", text: "Do you have a motto or saying you live by?" },
            { id: "hope_future", text: "What are your hopes for your children and grandchildren's futures?" },
            { id: "final_thought", text: "If this book could carry one message across generations, what would you want it to be?" }
        ]
    }
];
