
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminApprovalRequest {
  adminEmail: string;
  newAdminDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminEmail, newAdminDetails }: AdminApprovalRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Sengani Girls Welfare Group <onboarding@resend.dev>",
      to: [adminEmail],
      subject: "New Administrator Account Approval Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Sengani Girls Welfare Group</h1>
          <h2>New Administrator Account Approval Required</h2>
          
          <p>A new administrator account has been requested with the following details:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Full Name:</strong> ${newAdminDetails.fullName}</p>
            <p><strong>Email:</strong> ${newAdminDetails.email}</p>
            <p><strong>Phone:</strong> ${newAdminDetails.phone}</p>
          </div>
          
          <p>Please log in to the admin dashboard to review and approve this administrator account.</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This is an automated message from the Sengani Girls Welfare Group system.
          </p>
        </div>
      `,
    });

    console.log("Admin approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-admin-approval-request function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
