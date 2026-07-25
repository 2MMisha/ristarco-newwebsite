require "json"

module Ristar
  # A generated page for one event, in one language, of one type
  # (overview / registration / schedule / results).
  class EventPage < Jekyll::PageWithoutAFile
    def initialize(site, lang, page_type, event, ui)
      @site = site
      @base = site.source
      @dir  = File.join(lang, "events", event["id"], page_type == "overview" ? "" : page_type)
      @name = "index.html"

      self.process(@name)
      self.data = {}
      self.data["layout"]     = "event"
      self.data["lang"]       = lang
      self.data["dir"]        = site.config["lang_dirs"][lang] || "ltr"
      self.data["page_type"]  = page_type
      self.data["event"]      = event
      self.data["t"]          = event["translations"][lang] || event["translations"][site.config["default_language"]]
      self.data["ui"]         = ui
      self.data["title"]      = self.data["t"]["name"]
      self.data["permalink"]  = "/#{lang}/events/#{event['id']}/#{page_type == 'overview' ? '' : page_type + '/'}"

      t = self.data["t"]
      self.data["description"] = case page_type
        when "overview"     then t["description"]
        when "registration" then "#{ui['register']} — #{t['name']}, #{t['location']}, #{event['date']}."
        when "schedule"     then "#{ui['schedule']} — #{t['name']}, #{t['location']}, #{event['date']}."
        when "results"      then "#{ui['results']} — #{t['name']}, #{t['location']}, #{event['date']}."
      end
    end
  end

  class EventsIndexPage < Jekyll::PageWithoutAFile
    def initialize(site, lang, events, ui)
      @site = site
      @base = site.source
      @dir  = File.join(lang, "events")
      @name = "index.html"

      self.process(@name)
      self.data = {}
      self.data["layout"]    = "events_index"
      self.data["lang"]      = lang
      self.data["dir"]       = site.config["lang_dirs"][lang] || "ltr"
      self.data["events"]    = events
      self.data["ui"]        = ui
      self.data["title"]     = ui["nav_events"]
      self.data["permalink"] = "/#{lang}/events/"
      self.data["description"] = ui["gallery_meta_description"]
    end
  end

  class EventsGenerator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      languages = site.config["languages"] || ["en"]
      ui_data   = site.data["ui"] || {}

      events = []
      events_source = site.data["events"] || {}
      events_source.each_value do |event|
        events << event
      end
      events.sort_by! { |e| e["date"] }

      languages.each do |lang|
        ui = ui_data[lang] || {}

        events.each do |event|
          %w[overview registration schedule results].each do |page_type|
            site.pages << EventPage.new(site, lang, page_type, event, ui)
          end
        end

        site.pages << EventsIndexPage.new(site, lang, events, ui)
      end
    end
  end
end
