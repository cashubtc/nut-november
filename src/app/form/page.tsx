"use client";

import { publishForm } from "@/actions/nostr";
import { useActionState } from "react";
import BackToHome from "../components/BackToHome";

function Page() {
  const [state, formAction] = useActionState(publishForm, null);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#B7CF4F] p-6 sm:p-8 md:p-12 lg:p-16">
      <div className="relative z-20 max-w-6xl w-full flex flex-col items-center">
        <BackToHome />
        <div className="bg-[#FAFAFA] border-4 border-[#B7CF4F] p-8 sm:p-12 md:p-16 lg:p-20 w-full">
          <div className="text-center mb-8">
            <h1
              className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold leading-[0.85] tracking-wider text-[#B7CF4F] mb-4"
              style={{
                fontFamily: "var(--font-sauce-tm)",
                letterSpacing: "0.05em",
              }}
            >
              SUBMIT PROJECT
            </h1>
            <p
              className="text-xl sm:text-2xl md:text-3xl text-gray-500 mb-8 uppercase"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Share your nuts with us
            </p>
          </div>

          <form
            action={formAction}
            className="flex flex-col gap-6 max-w-2xl mx-auto"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="projectName"
                className="text-lg font-bold text-[#B7CF4F] font-mono"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                className="border-4 border-[#B7CF4F] bg-white p-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-[#B7CF4F] font-mono">
                Is this your first Cashu contribution?
              </label>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="firstContribution"
                    value="yes"
                    className="w-5 h-5 border-2 border-[#B7CF4F] accent-[#B7CF4F] focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 cursor-pointer"
                    required
                  />
                  <span className="text-lg text-gray-800 font-mono">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="firstContribution"
                    value="no"
                    className="w-5 h-5 border-2 border-[#B7CF4F] accent-[#B7CF4F] focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 cursor-pointer"
                    required
                  />
                  <span className="text-lg text-gray-800 font-mono">No</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-lg font-bold text-[#B7CF4F] font-mono"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                className="border-4 border-[#B7CF4F] bg-white p-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 font-mono resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="githubRepo"
                className="text-lg font-bold text-[#B7CF4F] font-mono"
              >
                Github Repo
              </label>
              <input
                type="url"
                id="githubRepo"
                name="githubRepo"
                placeholder="https://github.com/username/repo"
                className="border-4 border-[#B7CF4F] bg-white p-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="demoLink"
                className="text-lg font-bold text-[#B7CF4F] font-mono"
              >
                Demo Link
              </label>
              <input
                type="url"
                id="demoLink"
                name="demoLink"
                placeholder="https://your-demo.com"
                className="border-4 border-[#B7CF4F] bg-white p-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contactInfo"
                className="text-lg font-bold text-[#B7CF4F] font-mono"
              >
                Contact Info
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                placeholder="Nostr, Email, Twitter, etc."
                className="border-4 border-[#B7CF4F] bg-white p-4 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B7CF4F] focus:ring-offset-2 font-mono"
                required
              />
            </div>

            {state?.error && (
              <div className="bg-red-100 border-4 border-red-500 p-4 text-red-800 font-mono text-lg">
                Error: {state.error}
              </div>
            )}

            {state?.success && (
              <div className="bg-green-100 border-4 border-green-500 p-4 text-green-800 font-mono text-lg">
                Project submitted successfully!
              </div>
            )}

            <button
              type="submit"
              className="inline-block px-10 py-5 bg-[#B7CF4F] text-white font-bold border-4 border-[#B7CF4F] hover:bg-[#9fb63e] text-lg font-mono mt-4 self-center"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Page;
