# LLM Integration Setup Guide

This guide walks you through setting up and using the LLM integration features in the Search-Ready AI Analyzer.

## Overview

The application now supports real-time testing with four major LLM providers:

- **OpenAI GPT** (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo)
- **Anthropic Claude** (Claude-3 Opus, Sonnet, Haiku)
- **Google Gemini** (Gemini Pro, Gemini Pro Vision)
- **Meta Llama** (via Replicate and Together AI)

## New Custom Industry Testing Workflow

The application now supports a more realistic testing approach:

### 1. Industry Selection

- Select your industry from the dropdown (Healthcare, Finance, Technology, etc.)

### 2. Content Selection

- Choose from uploaded content files or upload new ones
- Supports `.txt`, `.pdf`, `.doc`, `.docx`, `.md` files
- Mock files are provided for demonstration

### 3. LLM-Generated Prompts

- Set the number of prompts to generate (3-20)
- Click "Generate X [Industry] Prompts"
- The LLM creates realistic, industry-specific questions that customers would ask

### 4. Real Testing

- Selected content is tested against the generated prompts
- All configured LLM providers and models are used
- Results show which content gaps exist based on real LLM performance

## API Key Setup

### OpenAI (GPT Models)

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add billing information (pay-per-use)
4. Paste key in the OpenAI configuration section

**Pricing**: ~$0.01-0.06 per 1K tokens depending on model

### Anthropic (Claude Models)

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Generate a new key
4. Add payment method
5. Paste key in the Anthropic configuration section

**Pricing**: ~$0.015-0.075 per 1K tokens depending on model

### Google (Gemini Models)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Enable the Generative Language API
4. Paste key in the Google configuration section

**Pricing**: Free tier available, then ~$0.001-0.002 per 1K tokens

### Meta Llama (via Replicate)

1. Sign up at [Replicate](https://replicate.com/)
2. Go to Account → API Tokens
3. Create a new token
4. Add billing information
5. Paste token in the Replicate configuration section

**Pricing**: ~$0.001-0.01 per prediction depending on model size

### Meta Llama (via Together AI)

1. Sign up at [Together AI](https://api.together.xyz/)
2. Navigate to API Keys
3. Generate a new key
4. Add payment method
5. Paste key in the Together configuration section

**Pricing**: ~$0.0008-0.008 per 1K tokens depending on model

## Configuration Steps

1. **Open LLM Configuration Panel**

   - Click "Configure APIs" button
   - Panel shows all available providers

2. **Add API Keys**

   - Paste your API keys in the respective fields
   - Keys are masked for security after saving

3. **Select Models**

   - Check the models you want to use for testing
   - More models = more comprehensive results but higher cost

4. **Save Configuration**
   - Click "Save Configuration"
   - Green indicators show successfully configured providers

## Testing Options

### Quick Test (Legacy)

- Uses 3 pre-defined generic prompts
- Tests against mock content
- Good for initial setup verification

### Custom Industry Test (New)

1. **Select Content**: Choose files to test against
2. **Set Prompt Count**: Choose how many industry prompts to generate (3-20)
3. **Generate Prompts**: LLM creates realistic industry-specific questions
4. **Run Test**: Content tested against generated prompts with all configured models

## Understanding Results

### Success Rate

- Percentage of prompts that received satisfactory answers
- Based on content relevance and completeness

### Latency

- Average response time across all models
- Helps identify fastest providers for your use case

### Cost Analysis

- Total cost for the test run
- Broken down by provider and model

### Content Gaps

- Specific prompts that failed across multiple models
- Indicates content that needs improvement

### Provider Performance

- Comparative analysis of each LLM provider
- Success rates, latency, and cost per provider

## Best Practices

### Cost Management

- Start with smaller prompt counts (3-5) for initial testing
- Use Quick Test first to verify setup
- Monitor costs in provider dashboards

### Content Selection

- Test your most important content first
- Include diverse content types (pricing, features, support, etc.)
- Keep content chunks under 2000 characters for best results

### Prompt Generation

- Use industry-specific terminology
- Generate 5-10 prompts for comprehensive coverage
- Review generated prompts before testing

### Model Selection

- Start with 1-2 models per provider
- GPT-4 and Claude-3 generally provide highest quality
- Gemini Pro offers good balance of cost and performance

## Security Notes

- API keys are stored locally in your browser
- Keys are masked in the UI after saving
- No keys are sent to external servers except the respective LLM providers
- Clear browser data to remove stored keys

## Troubleshooting

### "No LLM providers configured"

- Ensure at least one API key is saved
- Check that the provider shows a green status indicator
- Verify API key is valid in the provider's dashboard

### "Failed to generate prompts"

- Check your API key has sufficient credits
- Verify the selected industry is supported
- Try reducing the number of prompts requested

### High latency or timeouts

- Some providers (especially Replicate) can be slow
- Try testing with fewer models simultaneously
- Check provider status pages for outages

### Unexpected costs

- Review pricing pages for each provider
- Monitor usage in provider dashboards
- Start with smaller tests to estimate costs

## Example Workflow

1. **Setup**: Configure OpenAI API key, select GPT-4 model
2. **Industry**: Select "Healthcare"
3. **Content**: Upload your product documentation PDF
4. **Prompts**: Generate 5 healthcare-specific prompts
5. **Test**: Run custom test to see how well your content answers healthcare questions
6. **Results**: Review gaps and improve content based on findings

## Support

For technical issues:

- Check browser console for error messages
- Verify API keys in provider dashboards
- Ensure sufficient credits/billing setup
- Review network connectivity

The LLM integration provides real performance data to replace mock analysis with actual AI testing results.

## Competitive Analysis Testing

### How It Works

The competitive analysis feature addresses the key business question: **"How often does my content appear in LLM responses vs my competitors?"**

#### Traditional Problem

- Most LLM testing only measures if relevant information is returned (e.g., "87% success rate")
- But LLMs pull from their entire training data, including competitors' content
- This doesn't tell you if YOUR content is winning the "prompt competition"

#### Our Solution: Content Visibility Score

Instead of measuring generic success, we measure **competitive positioning**:

1. **Content Fingerprinting**: Extract unique identifiers from your content

   - Company/brand names
   - Product names
   - Unique claims and value propositions
   - Key phrases that identify your content

2. **Competitive Prompt Generation**: Create industry-relevant prompts that should trigger responses about your domain

   - "What are the best [industry] solutions for [use case]?"
   - "Compare different [industry] products"
   - "Which companies offer [specific service]?"

3. **Multi-LLM Testing**: Test prompts across all configured LLM providers

   - GPT-4, Claude, Gemini, Llama, etc.
   - Analyze each response for content mentions

4. **Competitive Scoring**: Calculate visibility metrics
   - **Visibility Score**: Percentage of prompts where your content appears
   - **Competitive Rank**: Your position vs competitors in responses
   - **Missed Opportunities**: Prompts where competitors appeared but you didn't

### Key Metrics Explained

- **Content Win Rate**: 34% means your content is mentioned in 84 out of 247 relevant prompts
- **Missed Opportunities**: 163 prompts where competitors' content appeared instead of yours
- **Competitive Rank**: Your average position when mentioned (e.g., #3 out of 6 companies mentioned)

### Running Competitive Analysis

1. **Configure LLM Providers**: Set up API keys for multiple providers
2. **Select Content**: Choose content files to analyze or use demo content
3. **Choose Industry**: Select your industry for relevant prompt generation
4. **Run Test**: Click "Competitive Analysis" button
5. **Review Results**: See detailed breakdown by provider and prompt

### Understanding Results

The results show:

- **Per-Prompt Analysis**: How each prompt performed across different LLMs
- **Provider Comparison**: Which LLMs favor your content vs competitors
- **Content Mentions**: Actual snippets where your content appeared
- **Opportunity Analysis**: Specific prompts where you could improve

### Business Value

This testing reveals:

- **Real Market Position**: How visible your content is in the AI landscape
- **Competitive Gaps**: Where competitors are winning prompt responses
- **Content Optimization Opportunities**: Specific areas to improve
- **ROI of Content Investment**: Quantified impact of content improvements

### Technical Implementation

The system uses:

- **Natural Language Processing**: To extract content fingerprints
- **Semantic Analysis**: To detect content mentions in responses
- **Prominence Scoring**: To measure how prominently content appears
- **Statistical Analysis**: To calculate competitive rankings

This provides actionable business intelligence rather than just technical metrics.
