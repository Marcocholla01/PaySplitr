"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PaySplitr
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/auth/signin">
                <Button className="shadow-sm">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 shadow-sm">
              Secure Payment Distribution Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Streamline Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Payment Distribution
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Efficiently manage and distribute daily payments to 100+ recipients
            across 20 distributors with automated assignment, secure access
            control, and real-time tracking.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage payment distribution efficiently and
              securely
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-gray-100">
                  <CardHeader>
                    <div
                      className={`p-3 rounded-lg w-fit mb-3 ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {feature.items.map((item) => (
                        <li key={item} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`text-4xl font-bold mb-3 ${stat.textColor}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust our platform for secure
              payment distribution
            </p>
            <Link href="/auth/signin">
              <Button size="lg" className="shadow-md hover:shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-lg py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-indigo-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">PaySplitr</span>
            </div>
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} PaySplitr. All rights reserved. Built
              with security in mind.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: "CSV Upload & Processing",
    description:
      "Upload daily payment files with automatic validation and processing",
    items: [
      "Automatic data validation",
      "Bulk processing capabilities",
      "Error handling & reporting",
    ],
    color: "bg-blue-500",
  },
  {
    icon: Users,
    title: "Smart Distribution",
    description: "Automatically distribute records to 20 distributors evenly",
    items: [
      "Equal distribution algorithm",
      "No record overlap",
      "Real-time assignment",
    ],
    color: "bg-green-500",
  },
  {
    icon: Shield,
    title: "Secure Access Control",
    description: "Role-based authentication with secure data isolation",
    items: [
      "Admin & distributor roles",
      "Encrypted authentication",
      "Data access controls",
    ],
    color: "bg-purple-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track progress with comprehensive dashboards and reports",
    items: ["Live status tracking", "Performance metrics", "Historical data"],
    color: "bg-orange-500",
  },
  {
    icon: Clock,
    title: "Date-based Management",
    description: "Organize payments by date with historical tracking",
    items: [
      "Daily payment batches",
      "Historical records",
      "Date-based filtering",
    ],
    color: "bg-red-500",
  },
  {
    icon: CheckCircle,
    title: "Status Management",
    description: "Track payment status from pending to completion",
    items: ["Status updates", "Progress tracking", "Completion reports"],
    color: "bg-teal-500",
  },
];

const stats = [
  {
    value: "100+",
    label: "Daily Recipients",
    textColor: "text-blue-600",
  },
  {
    value: "20",
    label: "Active Distributors",
    textColor: "text-green-600",
  },
  {
    value: "99.9%",
    label: "Uptime",
    textColor: "text-purple-600",
  },
  {
    value: "24/7",
    label: "Support",
    textColor: "text-orange-600",
  },
];
